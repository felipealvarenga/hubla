export class CreateSaleDto {
  product_id: number;
  creator_id: number;
  affiliate_id?: number;
  date: Date;
  amount: number;
}
