import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateController } from './affiliate.controller';
import { AffiliateService } from './affiliate.service';

describe('AffiliateController', () => {
  let controller: AffiliateController;

  const mockAffiliateService = {
    findAll: jest.fn(),
    getBalance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateController],
      providers: [AffiliateService],
    })
      .overrideProvider(AffiliateService)
      .useValue(mockAffiliateService)
      .compile();

    controller = module.get<AffiliateController>(AffiliateController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of affiliates', async () => {
      const result = [{ id: 1, name: 'Affiliate 1' }];
      mockAffiliateService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();

      expect(response).toBe(result);
      expect(mockAffiliateService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if findAll fails', async () => {
      const error = new Error('findAll failed');
      mockAffiliateService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrowError(error);
      expect(mockAffiliateService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBalance', () => {
    it('should return an object with id, name, and balance properties', async () => {
      const result = { id: 1, name: 'Affiliate 1', balance: 100 };
      mockAffiliateService.getBalance.mockResolvedValue([result]);

      const response = await controller.getBalance('1');

      expect(response).toEqual(result);
      expect(mockAffiliateService.getBalance).toHaveBeenCalledTimes(1);
      expect(mockAffiliateService.getBalance).toHaveBeenCalledWith(1);
    });

    it('should throw an error if getBalance fails', async () => {
      const error = new Error('getBalance failed');
      mockAffiliateService.getBalance.mockRejectedValue(error);

      await expect(controller.getBalance('1')).rejects.toThrowError(error);
      expect(mockAffiliateService.getBalance).toHaveBeenCalledTimes(1);
      expect(mockAffiliateService.getBalance).toHaveBeenCalledWith(1);
    });
  });
});
