import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { authRouter, requireAuth } from './auth-routes.js';
import { DatabaseManager } from './database';
import { FileSessionStore } from './file-session-store';
import { PaginationQuerySchema, SchemaRegistry } from './schemas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cookieParser());
app.use(
  session({
    store: new FileSessionStore(),
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(express.json());

// Authentication routes (must be before generic /api/:resource routes)
app.use('/api/auth', authRouter);

const dbPath = path.join(__dirname, 'data');
const db = new DatabaseManager(dbPath);

const handleValidationError = (error: z.ZodError<any>, res: Response) => {
  const errors = error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return res.status(400).json({
    error: 'Validation failed',
    details: errors,
  });
};

const validateResource = (req: Request, res: Response, next: NextFunction) => {
  const { resource } = req.params;

  if (!db.resourceExists(resource)) {
    return res.status(405).json({
      error: `Resource '${resource}' not found. Available resources: ${db.getAllResources().join(', ')}`,
    });
  }

  next();
};

// Generic resource routes with authentication middleware
app.get(
  '/api/:resource',
  requireAuth,
  validateResource,
  (req: Request, res: Response) => {
    return res.status(401).send();
    try {
      const { resource } = req.params;

      const paginationResult = PaginationQuerySchema.safeParse(req.query);
      if (!paginationResult.success) {
        return handleValidationError(paginationResult.error, res);
      }

      const { page, limit } = paginationResult.data;
      const result = db.getAll(resource, page, limit);

      res.json(result);
    } catch (error) {
      console.error('Error in GET /api/:resource:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.get(
  '/api/:resource/:id',
  requireAuth,
  validateResource,
  (req: Request, res: Response) => {
    try {
      const { resource, id } = req.params;
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const item = db.getById(resource, numericId);

      if (!item) {
        return res
          .status(404)
          .json({ error: `Item with ID ${numericId} not found` });
      }

      res.json(item);
    } catch (error) {
      console.error('Error in GET /api/:resource/:id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.post(
  '/api/:resource',
  requireAuth,
  validateResource,
  (req: Request, res: Response) => {
    try {
      const { resource } = req.params;

      const resourceSchemas = (SchemaRegistry as any)[resource];
      if (!resourceSchemas || !resourceSchemas.create) {
        return res.status(400).json({
          error: `No schema defined for resource '${resource}'`,
        });
      }

      const validationResult = resourceSchemas.create.safeParse(req.body);
      if (!validationResult.success) {
        return handleValidationError(validationResult.error, res);
      }

      const newItem = db.create(resource, validationResult.data);

      res.status(201).json(newItem);
    } catch (error) {
      console.error('Error in POST /api/:resource:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.put(
  '/api/:resource/:id',
  requireAuth,
  validateResource,
  (req: Request, res: Response) => {
    try {
      const { resource, id } = req.params;
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const resourceSchemas = (SchemaRegistry as any)[resource];
      if (!resourceSchemas || !resourceSchemas.update) {
        return res.status(400).json({
          error: `No schema defined for resource '${resource}'`,
        });
      }

      const validationResult = resourceSchemas.update.safeParse(req.body);
      if (!validationResult.success) {
        return handleValidationError(validationResult.error, res);
      }

      const updatedItem = db.update(resource, numericId, validationResult.data);

      if (!updatedItem) {
        return res
          .status(404)
          .json({ error: `Item with ID ${numericId} not found` });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error('Error in PUT /api/:resource/:id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.delete(
  '/api/:resource/:id',
  requireAuth,
  validateResource,
  (req: Request, res: Response) => {
    try {
      const { resource, id } = req.params;
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        return res.status(400).json({ error: 'Invalid ID format' });
      }

      const deleted = db.delete(resource, numericId);

      if (!deleted) {
        return res
          .status(404)
          .json({ error: `Item with ID ${numericId} not found` });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error in DELETE /api/:resource/:id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

app.use((error: Error, req: Request, res: Response) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Available resources: ${db.getAllResources().join(', ')}`);
});
