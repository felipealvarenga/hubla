import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AffiliateService } from './affiliate.service';
import { Affiliate } from './entities/affiliate.entity';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { Creator } from '../creator/entities/creator.entity';

describe('AffiliateService', () => {
  let service: AffiliateService;
  let repository: Repository<Affiliate>;

  beforeEach(async () => {
    const mockRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliateService,
        {
          provide: getRepositoryToken(Affiliate),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AffiliateService>(AffiliateService);
    repository = module.get<Repository<Affiliate>>(
      getRepositoryToken(Affiliate),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('save', () => {
    it('should save a new affiliate', async () => {
      const createAffiliateDto: CreateAffiliateDto = {
        name: 'Test Affiliate',
        creator_id: 1,
      };
      const affiliate = new Affiliate();
      affiliate.name = createAffiliateDto.name;

      const creator = new Creator();
      creator.id = 1;
      creator.name = 'Test Creator';

      affiliate.creator = creator;

      const saveSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValueOnce(affiliate);

      jest.spyOn(repository, 'create').mockReturnValue(affiliate);
      const result = await service.save(createAffiliateDto);

      expect(saveSpy).toHaveBeenCalledWith(affiliate);
      expect(result).toEqual(affiliate);
    });

    it('should return an existing affiliate if it exists', async () => {
      const createAffiliateDto: CreateAffiliateDto = {
        name: 'Test Affiliate',
        creator_id: 1,
      };
      const existingAffiliate = new Affiliate();
      existingAffiliate.id = 1;
      existingAffiliate.name = createAffiliateDto.name;
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(existingAffiliate);

      const result = await service.save(createAffiliateDto);

      expect(findOneBySpy).toHaveBeenCalledWith({
        name: createAffiliateDto.name,
      });
      expect(result).toEqual(existingAffiliate);
    });
  });

  describe('findByName', () => {
    it('should return an affiliate by name', async () => {
      const affiliate = new Affiliate();
      affiliate.id = 1;
      affiliate.name = 'Test Affiliate';
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(affiliate);

      const result = await service.findByName(affiliate.name);

      expect(findOneBySpy).toHaveBeenCalledWith({ name: affiliate.name });
      expect(result).toEqual(affiliate);
    });

    it('should return null if the affiliate is not found', async () => {
      const findOneBySpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValueOnce(null);

      const result = await service.findByName('Non-existing Affiliate');

      expect(findOneBySpy).toHaveBeenCalledWith({
        name: 'Non-existing Affiliate',
      });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all affiliates', async () => {
      const affiliates = [
        { id: 1, name: 'Affiliate 1' },
        { id: 2, name: 'Affiliate 2' },
      ];
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValueOnce(
          affiliates.map((a) => Object.assign(new Affiliate(), a)),
        );

      const result = await service.findAll();

      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual(affiliates);
    });
  });

  describe('getBalance', () => {
    // it('should return the balance for a specific affiliate', async () => {
    //   const affiliate = new Affiliate();
    //   affiliate.id = 1;
    //   affiliate.name = 'Test Affiliate';

    //   const comissions = new Array<Commission>();

    //   comissions.push({ id: 1, amount: 10 });
    //   affiliate.commissions = [
    //     { id: 1, amount: 10 },
    //     { id: 2, amount: 20 },
    //   ];
    //   const findSpy = jest
    //     .spyOn(repository, 'find')
    //     .mockResolvedValueOnce([affiliate]);
    //   const result = await service.getBalance(affiliate.id);

    //   expect(findSpy).toHaveBeenCalledWith({
    //     where: { id: affiliate.id },
    //     relations: { commissions: true },
    //   });
    //   expect(result).toEqual([
    //     {
    //       id: affiliate.id,
    //       name: affiliate.name,
    //       balance: 30,
    //     },
    //   ]);
    // });

    it('should return an empty array if the affiliate is not found', async () => {
      const findSpy = jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      const result = await service.getBalance(1);

      expect(findSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { commissions: true },
      });
      expect(result).toEqual([]);
    });
  });
});
