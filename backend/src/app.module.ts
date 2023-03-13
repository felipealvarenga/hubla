import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { CreatorModule } from './creator/creator.module';
import { ProductModule } from './product/product.module';
import { SaleModule } from './sale/sale.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { CommissionModule } from './commission/commission.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    UploadModule,
    CreatorModule,
    ProductModule,
    SaleModule,
    AffiliateModule,
    CommissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
