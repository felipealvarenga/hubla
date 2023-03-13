export class CreateCommissionDto {
  amount: number;
  date: Date;
  product_id: number;
  affiliate_id?: number;
  creator_id: number;
}
