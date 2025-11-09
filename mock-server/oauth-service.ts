export interface UserInfo {
  id: string;
  email: string;
  imageUrl?: string;
  name: string;
}

export interface TokenData {
  access_token: string;
}

export interface OAuthProvider {
  getTokenData(code: string): Promise<TokenData>;
  getUserInfo(tokenData: TokenData): Promise<UserInfo>;
}

export type AuthProvider = 'github';

async function makeHttpRequest<T>(
  url: string,
  options: {
    method: string;
    headers: Record<string, string>;
    body?: string;
  }
): Promise<T> {
  try {
    console.log(`[HTTP] Making ${options.method} request to ${url}`);

    const response = await fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const data = await response.text();
    console.log(
      `[HTTP] Response ${response.status}: ${data.substring(0, 200)}...`
    );

    if (response.ok) {
      return JSON.parse(data);
    } else {
      throw new Error(`HTTP ${response.status}: ${data}`);
    }
  } catch (error) {
    console.error(`[HTTP] Request failed:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

export class OAuthService {
  private providers: Record<AuthProvider, OAuthProvider> = {} as Record<
    AuthProvider,
    OAuthProvider
  >;

  registerProvider(
    provider: AuthProvider,
    implementation: OAuthProvider
  ): void {
    this.providers[provider] = implementation;
  }

  async getTokenData(provider: AuthProvider, code: string): Promise<TokenData> {
    const providerImpl = this.providers[provider];
    if (!providerImpl) {
      throw new Error(`Provider ${provider} is not supported`);
    }
    return providerImpl.getTokenData(code);
  }

  async getUserInfo(
    provider: AuthProvider,
    tokenData: TokenData
  ): Promise<UserInfo> {
    const providerImpl = this.providers[provider];
    if (!providerImpl) {
      throw new Error(`Provider ${provider} is not supported`);
    }
    return providerImpl.getUserInfo(tokenData);
  }

  getSupportedProviders(): AuthProvider[] {
    return Object.keys(this.providers) as AuthProvider[];
  }
}

export { makeHttpRequest };
