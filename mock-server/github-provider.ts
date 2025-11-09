import {
  makeHttpRequest,
  type OAuthProvider,
  type TokenData,
  type UserInfo,
} from './oauth-service.js';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserResponse {
  id: number;
  email: string;
  avatar_url: string;
  name: string;
  login: string;
}

export class GitHubProvider implements OAuthProvider {
  private clientId: string;
  private clientSecret: string;
  private tokenUrl: string;
  private apiUrl: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.GITHUB_CLIENT_ID || '';
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
    this.tokenUrl =
      process.env.GITHUB_TOKEN_URL ||
      'https://github.com/login/oauth/access_token';
    this.apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
    this.redirectUri = `${process.env.CLIENT_URL || 'http://localhost:5173'}/oauth/github/callback`;

    if (!this.clientId || !this.clientSecret) {
      console.warn(
        'GitHub OAuth credentials not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env'
      );
    }
  }

  async getTokenData(code: string): Promise<TokenData> {
    const tokenData = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    });

    console.log(`[GitHub OAuth] Token exchange request:`, {
      url: this.tokenUrl,
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      code: code.substring(0, 10) + '...',
    });

    const response = await makeHttpRequest<GitHubTokenResponse>(this.tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData.toString(),
    });

    return {
      access_token: response.access_token,
    };
  }

  async getUserInfo(tokenData: TokenData): Promise<UserInfo> {
    const response = await makeHttpRequest<GitHubUserResponse>(
      `${this.apiUrl}/user`,
      {
        method: 'GET',
        headers: {
          Authorization: `token ${tokenData.access_token}`,
          Accept: 'application/json',
          'User-Agent': 'Mock-Server-OAuth',
        },
      }
    );

    return {
      id: response.id.toString(),
      name: response.name || response.login,
      email: response.email,
      imageUrl: response.avatar_url,
    };
  }
}
