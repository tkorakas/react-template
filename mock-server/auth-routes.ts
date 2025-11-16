import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { GitHubProvider } from './github-provider.js';
import { MfaManager } from './mfa-manager.js';
import { OAuthService } from './oauth-service.js';
import './session-types.js';
import { UserManager } from './user-manager.js';
import { CreateUserSchema, LoginSchema } from './user-schemas.js';

const authRouter = Router();
const userManager = new UserManager();
const mfaManager = new MfaManager();
const oauthService = new OAuthService();

function initializeOAuthProviders() {
  oauthService.registerProvider('github', new GitHubProvider());
}

userManager.initialize().catch(console.error);

const handleValidationError = (error: z.ZodError, res: Response) => {
  return res.status(400).json({
    error: 'Validation failed',
    details: error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  });
};

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const userData = CreateUserSchema.parse(req.body);

    const user = await userManager.createUser(userData);

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    req.session.mfaVerified = true;

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error, res);
    }

    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return res.status(400).json({
          error: 'Validation failed',
          details: [
            {
              field: 'email',
              message: 'A user with this email already exists',
            },
          ],
        });
      }
    }

    console.error('Error in POST /register:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const loginData = LoginSchema.parse(req.body);

    const user = await userManager.authenticateUser(
      loginData.email,
      loginData.password
    );

    if (!user) {
      return res.status(400).json({
        error: 'Validation failed',
        details: [
          {
            field: 'email',
            message: 'Invalid email or password',
          },
        ],
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    if (user?.mfaEnabled) {
      mfaManager.generateOtp(user.id);

      req.session.mfaVerified = false;

      return res.status(409).json({
        error: 'MFA verification required',
        requiresMfa: true,
      });
    }

    req.session.mfaVerified = true;
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error, res);
    }

    console.error('Error in POST /login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const requirePartialAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.session.mfaVerified === false) {
    return res.status(401).json({ error: 'MFA verification required' });
  }

  next();
};

authRouter.post(
  '/verify-mfa',
  requirePartialAuth,
  (req: Request, res: Response) => {
    try {
      const { otp } = req.body;

      if (!otp || typeof otp !== 'string') {
        return res.status(400).json({ error: 'OTP code is required' });
      }

      if (!req.session.user) {
        return res.status(401).json({ error: 'Session not found' });
      }

      const isValidOtp = mfaManager.validateOtp(req.session.user.id, otp);

      if (!isValidOtp) {
        return res.status(400).json({ error: 'Invalid or expired OTP code' });
      }

      req.session.mfaVerified = true;

      res.json({
        message: 'MFA verification successful',
        user: req.session.user,
      });
    } catch (error) {
      console.error('Error in POST /verify-mfa:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

authRouter.post(
  '/oauth/:provider/callback',
  async (req: Request, res: Response) => {
    try {
      const { provider } = req.params;
      const { code } = req.body;

      if (!code || typeof code !== 'string') {
        return res
          .status(400)
          .json({ error: 'Authorization code is required' });
      }

      if (!provider || typeof provider !== 'string') {
        return res.status(400).json({ error: 'Provider is required' });
      }

      const tokenData = await oauthService.getTokenData(
        provider as 'github',
        code
      );

      const userInfo = await oauthService.getUserInfo(
        provider as 'github',
        tokenData
      );

      let user = await userManager.getUserByEmail(userInfo.email);

      if (!user) {
        user = await userManager.createOAuthUser({
          email: userInfo.email,
          name: userInfo.name,
          provider: provider,
          externalId: userInfo.id,
        });
      } else {
        const fullUser = await userManager.getFullUserByEmail(userInfo.email);
        if (fullUser && fullUser.provider !== provider) {
          return res.status(400).json({
            error: `Account exists with different provider: ${fullUser.provider}`,
          });
        }
      }

      req.session.user = user;
      req.session.mfaVerified = true;

      res.json(user);
    } catch (error) {
      console.error(
        `Error in POST /oauth/${req.params.provider}/callback:`,
        error
      );
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

authRouter.get('/oauth/:provider/authorize', (req: Request, res: Response) => {
  try {
    const { provider } = req.params;

    if (!provider || typeof provider !== 'string') {
      return res.status(400).json({ error: 'Provider is required' });
    }

    if (provider === 'github') {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      if (!clientId) {
        return res.status(500).json({ error: 'GitHub OAuth not configured' });
      }

      const redirectUri = `${clientUrl}/oauth/${provider}/callback`;
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${encodeURIComponent(redirectUri)}`;
      res.json({ authUrl });
    } else {
      res.status(400).json({ error: `Provider ${provider} is not supported` });
    }
  } catch (error) {
    console.error(
      `Error in GET /oauth/${req.params.provider}/authorize:`,
      error
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/logout', requireAuth, (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }

    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logout successful' });
  });
});

authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.session.mfaVerified === false) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(401).json({ error: 'Not authenticated' });
    });
    return;
  }

  res.json({ ...req.session.user });
});

export { authRouter, initializeOAuthProviders, requireAuth, userManager };
