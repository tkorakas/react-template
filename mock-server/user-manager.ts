import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { CreateUser, User, UserResponse } from './user-schemas.js';

export class UserManager {
  private users: User[] = [];
  private readonly dataPath: string;

  constructor() {
    this.dataPath = join(process.cwd(), 'mock-server', 'data', 'users.json');
  }

  async initialize(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      this.users = JSON.parse(data);
      console.log(`✓ Loaded users: ${this.users.length} items`);
    } catch (_error) {
      console.log(
        'No existing users file found, starting with empty user list'
      );
      this.users = [];
      await this.saveUsers();
    }
  }

  private async saveUsers(): Promise<void> {
    try {
      await fs.writeFile(this.dataPath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  }

  async createUser(userData: CreateUser): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // Plain text for mock server
    };

    this.users.push(user);
    await this.saveUsers();

    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return null;
    }

    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      return null;
    }

    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return null;
    }

    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return null;
    }

    const { password: _password, ...userResponse } = user;
    return userResponse;
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.users.map(({ password: _password, ...user }) => user);
  }

  async updateUser(
    id: string,
    updates: Partial<Omit<CreateUser, 'password'>>
  ): Promise<UserResponse | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    const user = this.users[userIndex];
    const updatedUser: User = {
      ...user,
      ...updates,
    };

    this.users[userIndex] = updatedUser;
    await this.saveUsers();

    const { password: _password, ...userResponse } = updatedUser;
    return userResponse;
  }

  async deleteUser(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    await this.saveUsers();
    return true;
  }
}
