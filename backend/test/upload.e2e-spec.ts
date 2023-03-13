import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('UploadController (e2e)', () => {
  let app;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload and parse a valid file successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', 'test/files/sales.txt');

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'File uploaded and processed successfully',
    });
  });

  it('should fail to upload a file with invalid data', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', 'test/files/invalid.txt');

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid date');
  });

  it('should fail to upload a file with invalid dates', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', 'test/files/invalid_dates.txt');

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid date');
  });
});
