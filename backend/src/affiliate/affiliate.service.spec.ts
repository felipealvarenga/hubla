import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Affiliate } from './entities/affiliate.entity';
import { Sale } from '../sale/entities/sale.entity';
import { Commission } from '../commission/entities/commission.entity';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';

describe('AffiliateService', () => {
  let affiliateService: AffiliateService;
  let affiliateRepositoryMock: Record<string, jest.Mock>;
  let saleRepositoryMock: Record<string, jest.Mock>;
  let commissionRepositoryMock: Record<string, jest.Mock>;

  const affiliate = new Affiliate();
  affiliate.id = 1;
  affiliate.name = 'John Doe';

  beforeEach(async () => {
    affiliateRepositoryMock = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    };
    saleRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
    };
    commissionRepositoryMock = {
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliateService,
        {
          provide: getRepositoryToken(Affiliate),
          useValue: affiliateRepositoryMock,
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

    affiliateService = module.get<AffiliateService>(AffiliateService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('save', () => {
    it('should save a new affiliate', async () => {
      const createAffiliateDto: CreateAffiliateDto = {
        creator_id: 1,
        name: 'Jane Doe',
      };
      affiliateRepositoryMock.findOneBy.mockResolvedValueOnce(null);
      affiliateRepositoryMock.save.mockResolvedValueOnce(affiliate);
      affiliateRepositoryMock.create.mockReturnValue(affiliate);

      const result = await affiliateService.save(createAffiliateDto);

      expect(affiliateRepositoryMock.save).toHaveBeenCalledWith(affiliate);
      expect(result).toStrictEqual(affiliate);
    });

    it('should return an existing affiliate', async () => {
      const createAffiliateDto: CreateAffiliateDto = {
        name: affiliate.name,
        creator_id: 1,
      };
      affiliateRepositoryMock.findOneBy.mockResolvedValueOnce(affiliate);

      const result = await affiliateService.save(createAffiliateDto);

      expect(affiliateRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: createAffiliateDto.name,
      });
      expect(affiliateRepositoryMock.save).not.toHaveBeenCalled();
      expect(result).toBe(affiliate);
    });
  });

  describe('findAll', () => {
    it('should return an array of affiliates', async () => {
      affiliateRepositoryMock.find.mockResolvedValueOnce([affiliate]);

      const result = await affiliateService.findAll();

      expect(affiliateRepositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual([affiliate]);
    });
  });

  describe('findByName', () => {
    it('should return an affiliate', async () => {
      affiliateRepositoryMock.findOneBy.mockResolvedValueOnce(affiliate);

      const result = await affiliateService.findByName(affiliate.name);

      expect(affiliateRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: affiliate.name,
      });
      expect(result).toBe(affiliate);
    });

    it('should return null if affiliate is not found', async () => {
      affiliateRepositoryMock.findOneBy.mockResolvedValueOnce(null);

      const result = await affiliateService.findByName('Unknown');

      expect(affiliateRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: 'Unknown',
      });
      expect(result).toBeNull();
    });
  });

  describe('getBalance', () => {
    it('should return the balance of an affiliate', async () => {
      const commission1 = new Commission();
      commission1.amount = 100;
      const commission2 = new Commission();
      commission2.amount = 50;

      affiliateRepositoryMock.find.mockResolvedValueOnce([
        { ...affiliate, commissions: [commission1, commission2] },
      ]);

      const result = await affiliateService.getBalance(affiliate.id);

      expect(affiliateRepositoryMock.find).toHaveBeenCalledWith({
        where: { id: affiliate.id },
        relations: { commissions: true },
      });
      expect(result).toEqual([
        {
          id: affiliate.id,
          name: affiliate.name,
          balance: 150,
        },
      ]);
    });
  });
});
