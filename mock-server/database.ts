import fs from 'fs';
import path from 'path';

interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type { BaseEntity };

export class DatabaseManager {
  private data: Map<string, BaseEntity[]> = new Map();
  private dataPath: string;

  constructor(dataPath: string) {
    this.dataPath = dataPath;
    this.loadData();
  }

  private loadData(): void {
    try {
      const files = fs.readdirSync(this.dataPath);

      files.forEach(file => {
        if (path.extname(file) === '.json') {
          const resource = path.basename(file, '.json');
          const filePath = path.join(this.dataPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const data = JSON.parse(fileContent);

          this.data.set(resource, Array.isArray(data) ? data : [data]);
          console.log(
            `✓ Loaded ${resource}: ${this.data.get(resource)?.length || 0} items`
          );
        }
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  getAllResources(): string[] {
    return Array.from(this.data.keys());
  }

  getAll(
    resource: string,
    page: number = 1,
    limit: number = 10
  ): PaginatedResponse<BaseEntity> {
    const items = this.data.get(resource) || [];
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: items.slice(startIndex, endIndex),
      page,
      limit,
      total,
      totalPages,
    };
  }

  getById(resource: string, id: number): BaseEntity | null {
    const items = this.data.get(resource) || [];
    return items.find(item => item.id === id) || null;
  }

  create(
    resource: string,
    item: Omit<BaseEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): BaseEntity {
    const items = this.data.get(resource) || [];

    // Generate new ID
    const maxId = items.length > 0 ? Math.max(...items.map(i => i.id)) : 0;
    const newItem: BaseEntity = {
      ...item,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    this.data.set(resource, items);

    return newItem;
  }

  update(
    resource: string,
    id: number,
    updates: Partial<Omit<BaseEntity, 'id' | 'createdAt'>>
  ): BaseEntity | null {
    const items = this.data.get(resource) || [];
    const index = items.findIndex(item => item.id === id);

    if (index === -1) return null;

    const updatedItem: BaseEntity = {
      ...items[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    this.data.set(resource, items);

    return updatedItem;
  }

  delete(resource: string, id: number): boolean {
    const items = this.data.get(resource) || [];
    const index = items.findIndex(item => item.id === id);

    if (index === -1) return false;

    items.splice(index, 1);
    this.data.set(resource, items);

    return true;
  }

  resourceExists(resource: string): boolean {
    return this.data.has(resource);
  }
}

export default DatabaseManager;
