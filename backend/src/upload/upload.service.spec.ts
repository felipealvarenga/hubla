import { SaleService } from './../sale/sale.service';
import { CreatorService } from './../creator/creator.service';
import { CommissionService } from './../commission/commission.service';
import { ProductService } from './../product/product.service';
import { AffiliateService } from './../affiliate/affiliate.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UploadService } from './upload.service';
import { Row } from './row';

describe('UploadService', () => {
  let uploadService: UploadService;
  let affiliateServiceMock: Record<string, jest.Mock>;
  let productServiceMock: Record<string, jest.Mock>;
  let commissionServiceMock: Record<string, jest.Mock>;
  let creatorServiceMock: Record<string, jest.Mock>;
  let saleServiceMock: Record<string, jest.Mock>;
  const partialMulterFile: Express.Multer.File = {
    buffer: Buffer.from(''),
    fieldname: '',
    originalname: '',
    encoding: '',
    mimetype: '',
    destination: '',
    filename: '',
    path: '',
    size: 0,
    stream: null,
  };

  beforeEach(async () => {
    creatorServiceMock = {
      save: jest.fn(),
    };
    productServiceMock = {
      save: jest.fn(),
      findByName: jest.fn(),
    };
    saleServiceMock = {
      create: jest.fn(),
    };
    affiliateServiceMock = {
      save: jest.fn(),
      findByName: jest.fn(),
    };
    commissionServiceMock = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: CreatorService, useValue: creatorServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: SaleService, useValue: saleServiceMock },
        { provide: AffiliateService, useValue: affiliateServiceMock },
        { provide: CommissionService, useValue: commissionServiceMock },
      ],
    }).compile();

    uploadService = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('handleCreatorSale', () => {
    it('should create a sale', async () => {
      const creatorData = {
        id: '1',
        name: 'JOSE CARLOS',
      };
      const productData = {
        creator: creatorData,
        id: '1',
        date: new Date('2022-01-15T22:20:30.000Z'),
        amount: 12750,
      };
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer: Buffer.from(
          '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS',
        ),
      };

      const creatorFindByNameSpy = jest
        .spyOn(creatorServiceMock, 'save')
        .mockResolvedValueOnce(creatorData);
      const productServiceSaveSpy = jest
        .spyOn(productServiceMock, 'save')
        .mockResolvedValueOnce(productData);
      const saleServiceCreateSpy = jest
        .spyOn(saleServiceMock, 'create')
        .mockResolvedValueOnce({ id: productData.creator.id });

      const result = await uploadService.parseAndSave(file);

      expect(result).toEqual({
        message: 'File uploaded and processed successfully',
      });
      expect(creatorFindByNameSpy).toBeCalledWith({ name: 'JOSE CARLOS' });
      expect(productServiceSaveSpy).toBeCalledWith({
        name: 'CURSO DE BEM-ESTAR',
        creator_id: creatorData.id,
      });
      expect(saleServiceCreateSpy).toBeCalledWith({
        creator_id: productData.creator.id,
        product_id: '1',
        date: productData.date,
        amount: productData.amount,
      });
    });
  });

  describe('handleAffiliateSale', () => {
    it('should create an affiliate sale', async () => {
      const buffer = Buffer.from(
        '22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA',
      );
      const row = new Row(
        '2',
        new Date('2022-01-16T17:13:54.000Z'),
        'CURSO DE BEM-ESTAR',
        12750,
        'THIAGO OLIVEIRA',
      );
      const productData = {
        id: '1',
        name: 'CURSO DE BEM-ESTAR',
        creator: {
          id: '1',
          name: 'JOSE CARLOS',
        },
      };
      const affiliate_id = '3';
      const saleData = {
        id: '1',
        date: new Date('2022-01-16T17:13:54.000Z'),
        amount: 12750,
      };

      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer,
      };

      const productFindByNameSpy = jest
        .spyOn(productServiceMock, 'findByName')
        .mockResolvedValueOnce(productData);
      const affiliateFindByNameSpy = jest
        .spyOn(affiliateServiceMock, 'save')
        .mockResolvedValueOnce({
          id: affiliate_id,
        });
      const saleServiceCreateSpy = jest
        .spyOn(saleServiceMock, 'create')
        .mockResolvedValueOnce(saleData);

      const result = await uploadService.parseAndSave(file);

      expect(result).toEqual({
        message: 'File uploaded and processed successfully',
      });
      expect(affiliateFindByNameSpy).toBeCalledWith({
        creator_id: productData.creator.id,
        name: row.seller,
      });
      expect(productFindByNameSpy).toBeCalledWith('CURSO DE BEM-ESTAR');
      expect(saleServiceCreateSpy).toBeCalledWith({
        affiliate_id,
        product_id: productData.id,
        date: saleData.date,
        amount: saleData.amount,
        creator_id: productData.creator.id,
      });
    });

    it('should throw an error if the product does not exist', async () => {
      const buffer = Buffer.from(
        '22022-01-16T14:13:54-03:00CURSO DE BEM-EST4R            0000012750THIAGO OLIVEIRA',
      );
      const productName = 'CURSO DE BEM-EST4R';
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer,
      };

      const productFindByNameSpy = jest
        .spyOn(productServiceMock, 'findByName')
        .mockResolvedValueOnce(null);

      expect(() => uploadService.parseAndSave(file)).rejects.toThrow(
        new HttpException(
          `Product ${productName} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(productFindByNameSpy).toBeCalledWith(productName);
    });
  });

  describe('handlePaidCommission', () => {
    it('should create a commission', async () => {
      const productData = {
        creator: { id: '1' },
        id: '1',
        date: new Date('2022-01-16T17:13:54.000Z'),
        amount: -4500,
      };
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer: Buffer.from(
          '32022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS',
        ),
      };

      const productFindByNameSpy = jest
        .spyOn(productServiceMock, 'findByName')
        .mockResolvedValueOnce(productData);
      const commissionServiceCreateSpy = jest
        .spyOn(commissionServiceMock, 'create')
        .mockResolvedValueOnce({ id: productData.creator.id });

      const result = await uploadService.parseAndSave(file);

      expect(result).toEqual({
        message: 'File uploaded and processed successfully',
      });
      expect(productFindByNameSpy).toBeCalledWith('CURSO DE BEM-ESTAR');
      expect(commissionServiceCreateSpy).toBeCalledWith({
        creator_id: productData.creator.id,
        product_id: productData.id,
        date: productData.date,
        amount: productData.amount,
      });
    });

    it('should throw an error if the product does not exist', async () => {
      const productName = 'CURSO DE BEM-EST4R';
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer: Buffer.from(
          '32022-01-16T14:13:54-03:00CURSO DE BEM-EST4R            0000004500JOSE CARLOS',
        ),
      };

      const productFindByNameSpy = jest
        .spyOn(productServiceMock, 'findByName')
        .mockResolvedValueOnce(null);

      expect(() => uploadService.parseAndSave(file)).rejects.toThrow(
        new HttpException(
          `Product ${productName} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(productFindByNameSpy).toBeCalledWith(productName);
    });
  });

  describe('handleReceivedCommission', () => {
    it('should create a commission', async () => {
      const buffer = Buffer.from(
        '42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500THIAGO OLIVEIRA',
      );
      const row = {
        date: new Date('2022-01-16T17:13:54.000Z'),
        product: 'CURSO DE BEM-ESTAR',
        amount: 4500,
        seller: 'THIAGO OLIVEIRA',
        type: 4,
      };
      const affiliateId = 3;
      const productData = {
        creator: { id: '1' },
        id: '1',
      };
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer,
      };

      const affiliateFindByNameSpy = jest
        .spyOn(affiliateServiceMock, 'findByName')
        .mockResolvedValueOnce({ id: affiliateId });
      const productFindByNameSpy = jest
        .spyOn(productServiceMock, 'findByName')
        .mockResolvedValueOnce(productData);
      const commissionServiceCreateSpy = jest
        .spyOn(commissionServiceMock, 'create')
        .mockResolvedValueOnce({ id: productData.creator.id });

      const result = await uploadService.parseAndSave(file);

      expect(result).toEqual({
        message: 'File uploaded and processed successfully',
      });
      expect(affiliateFindByNameSpy).toBeCalledWith(row.seller);
      expect(productFindByNameSpy).toBeCalledWith(row.product);
      expect(commissionServiceCreateSpy).toBeCalledWith({
        creator_id: productData.creator.id,
        product_id: productData.id,
        affiliate_id: affiliateId,
        date: row.date,
        amount: row.amount,
      });
    });

    it('should throw an error if the affiliate does not exist', async () => {
      const buffer = Buffer.from(
        '42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500THIAGO OLIVEIRA',
      );
      const affiliateName = 'THIAGO OLIVEIRA';
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer,
      };

      jest
        .spyOn(affiliateServiceMock, 'findByName')
        .mockResolvedValueOnce(null);

      expect(() => uploadService.parseAndSave(file)).rejects.toThrow(
        new HttpException(
          `Affiliate ${affiliateName} not found`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if the product does not exist', async () => {
      const buffer = Buffer.from(
        '42022-01-16T14:13:54-03:00CURSO DE BEM-EST4R            0000004500THIAGO OLIVEIRA',
      );
      const productName = 'CURSO DE BEM-EST4R';
      const file: Express.Multer.File = {
        ...partialMulterFile,
        buffer,
      };

      jest
        .spyOn(affiliateServiceMock, 'findByName')
        .mockResolvedValueOnce({ id: 1 });
      jest.spyOn(productServiceMock, 'findByName').mockResolvedValueOnce(null);

      expect(() => uploadService.parseAndSave(file)).rejects.toThrow(
        new HttpException(
          `Product ${productName} not found`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
