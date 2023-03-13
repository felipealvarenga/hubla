import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Sale } from '../sale/entities/sale.entity';
import { Product } from './entities/product.entity';
import { Commission } from '../commission/entities/commission.entity';
import { Creator } from '../creator/entities/creator.entity';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepositoryMock: Record<string, jest.Mock>;
  let saleRepositoryMock: Record<string, jest.Mock>;
  let commissionRepositoryMock: Record<string, jest.Mock>;

  const product = new Product();
  product.id = 1;
  product.name = 'Product A';
  const creator = new Creator();
  creator.id = 1;
  product.creator = creator;

  beforeEach(async () => {
    productRepositoryMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    };
    saleRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
    };
    commissionRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepositoryMock,
        },
        {
          provide: getRepositoryToken(Sale),
          useValue: saleRepositoryMock,
        },
        {
          provide: getRepositoryToken(Commission),
          useValue: commissionRepositoryMock,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('save', () => {
    it('should save a new product', async () => {
      const createProductDto = { name: 'Product B', creator_id: 1 };
      productRepositoryMock.findOne.mockResolvedValueOnce(null);
      productRepositoryMock.create.mockReturnValueOnce(product);
      productRepositoryMock.save.mockResolvedValueOnce(product);

      const result = await productService.save(createProductDto);

      expect(productRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
        relations: ['creator'],
      });
      expect(productRepositoryMock.create).toHaveBeenCalledWith({
        name: createProductDto.name,
        creator: { id: createProductDto.creator_id },
      });
      expect(productRepositoryMock.save).toHaveBeenCalledWith(product);
      expect(result).toBe(product);
    });

    it('should return an existing product', async () => {
      const createProductDto = { name: product.name, creator_id: 1 };
      productRepositoryMock.findOne.mockResolvedValueOnce(product);

      const result = await productService.save(createProductDto);

      expect(productRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { name: createProductDto.name },
        relations: ['creator'],
      });
      expect(productRepositoryMock.create).not.toHaveBeenCalled();
      expect(productRepositoryMock.save).not.toHaveBeenCalled();
      expect(result).toBe(product);
    });
  });

  describe('findAllWithSalesAndCommissions', () => {
    it('should return an array of products with sales and commissions', async () => {
      const product1 = new Product();
      product1.id = 1;
      product1.name = 'Product 1';
      const sale1 = new Sale();
      sale1.id = 1;
      sale1.amount = 100;
      sale1.product = product1;
      const commission1 = new Commission();
      commission1.id = 1;
      commission1.amount = 50;
      commission1.product = product1;
      const product2 = new Product();
      product2.id = 2;
      product2.name = 'Product 2';
      const sale2 = new Sale();
      sale2.id = 2;
      sale2.amount = 200;
      sale2.product = product2;
      const commission2 = new Commission();
      commission2.id = 2;
      commission2.amount = 100;
      commission2.product = product2;

      productRepositoryMock.find.mockResolvedValueOnce([product1, product2]);

      saleRepositoryMock.createQueryBuilder.mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([sale1, sale2]),
      });

      commissionRepositoryMock.createQueryBuilder.mockReturnValueOnce({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([commission1, commission2]),
      });

      const result = await productService.findAllWithSalesAndCommissions();

      expect(productRepositoryMock.find).toHaveBeenCalled();
      expect(saleRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'sale',
      );
      expect(commissionRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'commission',
      );
      expect(result).toEqual([
        {
          id: product1.id,
          name: product1.name,
          creator: product1.creator,
          sales: [sale1],
          commissions: [commission1],
        },
        {
          id: product2.id,
          name: product2.name,
          creator: product2.creator,
          sales: [sale2],
          commissions: [commission2],
        },
      ]);
    });
  });
});
