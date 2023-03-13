import { Test, TestingModule } from '@nestjs/testing';
import { CommissionService } from './commission.service';
import { Commission } from './entities/commission.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommissionDto } from './dto/create-commission.dto';

describe('CommissionService', () => {
  let service: CommissionService;
  let repository: Repository<Commission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionService,
        {
          provide: getRepositoryToken(Commission),
          useClass: class MockRepository extends Repository<Commission> {},
        },
      ],
    }).compile();

    service = module.get<CommissionService>(CommissionService);
    repository = module.get<Repository<Commission>>(
      getRepositoryToken(Commission),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCommissionDto: CreateCommissionDto = {
      amount: 100,
      date: new Date(),
      product_id: 1,
      affiliate_id: 2,
      creator_id: 3,
    };

    it('should create a commission', async () => {
      const commission = new Commission();
      jest.spyOn(repository, 'create').mockReturnValue(commission);
      jest.spyOn(repository, 'save').mockResolvedValue(commission);

      const result = await service.create(createCommissionDto);

      expect(result).toBe(commission);
      expect(repository.create).toHaveBeenCalledWith({
        amount: createCommissionDto.amount,
        date: createCommissionDto.date,
        product: { id: createCommissionDto.product_id },
        creator: { id: createCommissionDto.creator_id },
        affiliate: { id: createCommissionDto.affiliate_id },
      });
      expect(repository.save).toHaveBeenCalledWith(commission);
    });

    it('should throw an error if product_id or creator_id is not provided', async () => {
      const defaultValues: CreateCommissionDto = {
        amount: 100,
        date: new Date(),
        product_id: 1,
        affiliate_id: 2,
        creator_id: 3,
      };

      const createCommissionDtoWithoutProductId: CreateCommissionDto =
        Object.assign({ ...defaultValues }, { product_id: undefined });

      const createCommissionDtoWithoutCreatorId: CreateCommissionDto =
        Object.assign({ ...defaultValues }, { creator_id: undefined });

      await expect(
        service.create(createCommissionDtoWithoutProductId),
      ).rejects.toThrowError();

      await expect(
        service.create(createCommissionDtoWithoutCreatorId),
      ).rejects.toThrowError();
    });

    it('should throw an error when the date is not provided', async () => {
      // Arrange
      const createCommissionDto: CreateCommissionDto = {
        amount: 100,
        date: undefined, // date should be provided
        product_id: 1,
        affiliate_id: 2,
        creator_id: 3,
      };

      // Act and Assert
      await expect(service.create(createCommissionDto)).rejects.toThrowError();
    });
    it('should throw an error when the amount is not provided', async () => {
      // Arrange
      const createCommissionDto: CreateCommissionDto = {
        amount: undefined, // amount should be provided
        date: new Date(),
        product_id: 1,
        affiliate_id: 2,
        creator_id: 3,
      };

      // Act and Assert
      await expect(service.create(createCommissionDto)).rejects.toThrowError();
    });
  });
});
