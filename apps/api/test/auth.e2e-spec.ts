import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return tokens', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'test@nairobi-sculpt.com',
          password: 'Test@1234',
          name: 'Test User',
          role: 'PATIENT',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.user.email).toBe('test@nairobi-sculpt.com');
          expect(res.body.user.role).toBe('PATIENT');
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'test@nairobi-sculpt.com',
          password: 'Test@1234',
          name: 'Another User',
          role: 'PATIENT',
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@nairobi-sculpt.com',
          password: 'Test@1234',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('token');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@nairobi-sculpt.com',
          password: 'wrongpassword',
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'test@nairobi-sculpt.com',
          password: 'Test@1234',
        });
      refreshToken = response.body.refreshToken;
    });

    it('should refresh access token with valid refresh token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect((res: { body: Record<string, unknown> }) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });
  });
});
