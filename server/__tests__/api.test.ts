import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../index';

describe('API Routes', () => {
  let app: Express;
  
  beforeAll(async () => {
    app = await createServer();
  });

  it('GET /api/projects should return projects list', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
  
  it('POST /api/projects should create a new project', async () => {
    const newProject = {
      name: 'Test Project',
      description: 'Created during testing',
    };
    
    const response = await request(app)
      .post('/api/projects')
      .send(newProject);
      
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newProject.name);
  });
});

