import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';
import { Sale } from '../sale/entities/sale.entity';
import { Commission } from '../commission/entities/commission.entity';
import { CreatorService } from './creator.service';
import { CreateCreatorDto } from './dto/create-creator.dto';

describe('CreatorService', () => {
  let creatorService: CreatorService;
  let creatorRepositoryMock: Record<string, jest.Mock>;
  let saleRepositoryMock: Record<string, jest.Mock>;
  let commissionRepositoryMock: Record<string, jest.Mock>;

  const creator = new Creator();
  creator.id = 1;
  creator.name = 'John Doe';

  beforeEach(async () => {
    creatorRepositoryMock = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
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
        CreatorService,
        {
          provide: getRepositoryToken(Creator),
          useValue: creatorRepositoryMock,
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

    creatorService = module.get<CreatorService>(CreatorService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('save', () => {
    it('should save a new creator', async () => {
      const createCreatorDto: CreateCreatorDto = { name: 'Jane Doe' };
      creatorRepositoryMock.findOneBy.mockResolvedValueOnce(null);
      creatorRepositoryMock.save.mockResolvedValueOnce(creator);

      const result = await creatorService.save(createCreatorDto);

      expect(creatorRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: createCreatorDto.name,
      });
      expect(creatorRepositoryMock.save).toHaveBeenCalledWith(createCreatorDto);
      expect(result).toBe(creator);
    });

    it('should return an existing creator', async () => {
      const createCreatorDto: CreateCreatorDto = { name: creator.name };
      creatorRepositoryMock.findOneBy.mockResolvedValueOnce(creator);

      const result = await creatorService.save(createCreatorDto);

      expect(creatorRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: createCreatorDto.name,
      });
      expect(creatorRepositoryMock.save).not.toHaveBeenCalled();
      expect(result).toBe(creator);
    });
  });

  describe('findAll', () => {
    it('should return an array of creators', async () => {
      creatorRepositoryMock.find.mockResolvedValueOnce([creator]);

      const result = await creatorService.findAll();

      expect(creatorRepositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual([creator]);
    });
  });

  describe('findByName', () => {
    it('should return a creator', async () => {
      creatorRepositoryMock.findOneBy.mockResolvedValueOnce(creator);

      const result = await creatorService.findByName(creator.name);

      expect(creatorRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: creator.name,
      });
      expect(result).toBe(creator);
    });

    it('should return null if creator is not found', async () => {
      creatorRepositoryMock.findOneBy.mockResolvedValueOnce(null);

      const result = await creatorService.findByName('Unknown');

      expect(creatorRepositoryMock.findOneBy).toHaveBeenCalledWith({
        name: 'Unknown',
      });
      expect(result).toBeNull();
    });
  });

  describe('getBalance', () => {
    it('should return the balance of a creator', async () => {
      const sale = new Sale();
      sale.amount = 100;
      const commission = new Commission();
      commission.amount = 50;
      saleRepositoryMock.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([sale]),
      });

      commissionRepositoryMock.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([commission]),
      });

      creatorRepositoryMock.find.mockResolvedValueOnce([creator]);

      const result = await creatorService.getBalance(creator.id);

      expect(saleRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'sale',
      );
      expect(commissionRepositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'commission',
      );
      expect(creatorRepositoryMock.find).toHaveBeenCalledWith({
        where: { id: creator.id },
      });
      expect(result).toEqual({ ...creator, balance: 150 });
    });
  });
});
