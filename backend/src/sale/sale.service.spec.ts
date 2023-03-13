import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';

describe('SaleService', () => {
  let saleService: SaleService;
  let saleRepositoryMock: Record<string, jest.Mock>;

  const sale = new Sale();
  sale.id = 1;
  sale.date = new Date();
  sale.amount = 100;

  beforeEach(async () => {
    saleRepositoryMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleService,
        {
          provide: getRepositoryToken(Sale),
          useValue: saleRepositoryMock,
        },
      ],
    }).compile();

    saleService = module.get<SaleService>(SaleService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new sale', async () => {
      const createSaleDto: CreateSaleDto = {
        date: new Date(),
        amount: 100,
        product_id: 1,
        affiliate_id: 2,
        creator_id: 3,
      };
      saleRepositoryMock.create.mockReturnValueOnce(sale);
      saleRepositoryMock.save.mockResolvedValueOnce(sale);

      const result = await saleService.create(createSaleDto);

      expect(saleRepositoryMock.create).toHaveBeenCalledWith({
        date: createSaleDto.date,
        amount: createSaleDto.amount,
        product: { id: createSaleDto.product_id },
        creator: { id: createSaleDto.creator_id },
        affiliate: { id: createSaleDto.affiliate_id },
      });
      expect(saleRepositoryMock.save).toHaveBeenCalledWith(sale);
      expect(result).toBe(sale);
    });
  });
});
