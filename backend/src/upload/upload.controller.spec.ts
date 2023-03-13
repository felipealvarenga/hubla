import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('UploadController', () => {
  let uploadController: UploadController;

  const mockUploadService = {
    parseAndSave: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    uploadController = module.get<UploadController>(UploadController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('uploadFile', () => {
    it('should return an error message if no file is uploaded', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const file = undefined;

      await uploadController.uploadFile(response, file);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        message: 'No file uploaded',
      });
    });

    it('should call parseAndSave method of uploadService and return uploaded file', async () => {
      const response = {
        send: jest.fn(),
      };
      const file = {
        fieldname: 'file',
        originalname: 'test-file.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 4,
        buffer: Buffer.from('test'),
        stream: null,
        destination: null,
        filename: null,
        path: null,
      };

      jest
        .spyOn(mockUploadService, 'parseAndSave')
        .mockResolvedValueOnce(undefined);

      await uploadController.uploadFile(response, file);

      expect(mockUploadService.parseAndSave).toHaveBeenCalledWith(file);
      expect(response.send).toHaveBeenCalledWith(file);
    });
  });
});
