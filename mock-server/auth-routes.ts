import { Request, Response, Router } from 'express';
import { z } from 'zod';
import './session-types.js';
import { UserManager } from './user-manager.js';
import { CreateUserSchema, LoginSchema } from './user-schemas.js';

const authRouter = Router();
const userManager = new UserManager();

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

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error, res);
    }

    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ error: error.message });
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
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleValidationError(error, res);
    }

    console.error('Error in POST /login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

authRouter.post('/logout', (req: Request, res: Response) => {
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

  res.json({ ...req.session.user });
});

export const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export { authRouter, userManager };
