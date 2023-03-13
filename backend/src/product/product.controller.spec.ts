import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    findAllWithSalesAndCommissions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllProductsTransactions', () => {
    it('should return an array of products with sales and commissions data', async () => {
      const result = [
        {
          id: 1,
          name: 'CURSO',
          sales: [
            {
              id: 1,
              date: '2022-03-01T05:09:54.000Z',
              amount: 12750,
              product: {
                id: 1,
                name: 'CURSO',
              },
              creator: {
                id: 1,
                name: 'JOSE CARLOS',
              },
              affiliate: null,
            },
          ],
          commissions: [
            {
              id: 1,
              amount: -4500,
              date: '2022-01-16T17:13:54.000Z',
              product: {
                id: 1,
                name: 'CURSO',
              },
              creator: {
                id: 37,
                name: 'JOSE CARLOS',
              },
              affiliate: null,
            },
          ],
        },
      ];
      mockProductService.findAllWithSalesAndCommissions.mockResolvedValue(
        result,
      );

      const response = await controller.getAllProductsTransactions();

      expect(response).toBe(result);
      expect(
        mockProductService.findAllWithSalesAndCommissions,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if findAllWithSalesAndCommissions fails', async () => {
      const error = new Error('findAllWithSalesAndCommissions failed');
      mockProductService.findAllWithSalesAndCommissions.mockRejectedValue(
        error,
      );

      await expect(
        controller.getAllProductsTransactions(),
      ).rejects.toThrowError(error);
      expect(
        mockProductService.findAllWithSalesAndCommissions,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
