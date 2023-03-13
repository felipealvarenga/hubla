import { Test, TestingModule } from '@nestjs/testing';
import { CreatorController } from './creator.controller';
import { CreatorService } from './creator.service';

describe('CreatorController', () => {
  let controller: CreatorController;

  const mockCreatorService = {
    findAll: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorController],
      providers: [{ provide: CreatorService, useValue: mockCreatorService }],
    }).compile();

    controller = module.get<CreatorController>(CreatorController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of creators', async () => {
      const result = [
        { id: 1, name: 'Creator 1' },
        { id: 2, name: 'Creator 2' },
      ];
      mockCreatorService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockCreatorService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the service throws an error', async () => {
      const error = new Error('Internal Server Error');
      mockCreatorService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(mockCreatorService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBalance', () => {
    it('should return the balance of the specified creator', async () => {
      const creator_id = '1';
      const result = { balance: 100 };
      mockCreatorService.getBalance.mockResolvedValue(result);

      expect(await controller.getBalance(creator_id)).toBe(result);
      expect(mockCreatorService.getBalance).toHaveBeenCalledWith(+creator_id);
    });

    it('should throw an error if the specified creator does not exist', async () => {
      const creator_id = '999';
      const error = new Error('Creator not found');
      mockCreatorService.getBalance.mockRejectedValue(error);

      await expect(controller.getBalance(creator_id)).rejects.toThrow(error);
      expect(mockCreatorService.getBalance).toHaveBeenCalledWith(+creator_id);
    });
  });
});
