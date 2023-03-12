export class Row {
  errors: string[] = [];

  constructor(
    public readonly type: string,
    public readonly date: Date,
    public readonly product: string,
    public readonly amount: number,
    public readonly seller: string,
  ) {
    this.validate();
  }

  private validate() {
    const errors = [];

    // Validate "type" field
    if (this.type.length !== 1) {
      errors.push(`Invalid type: ${this.type}`);
    }
    // Validate "date" field
    if (!(this.date instanceof Date) || isNaN(this.date.getTime())) {
      errors.push(`Invalid date: ${this.date}`);
    }
    // Validate "product" field
    if (this.product.trim().length === 0) {
      errors.push(`Invalid product: ${this.product}`);
    }
    // Validate "amount" field
    if (isNaN(this.amount)) {
      errors.push(`Invalid amount: ${this.amount}`);
    }
    // Validate "seller" field
    if (this.seller.trim().length === 0) {
      errors.push(`Invalid seller: ${this.seller}`);
    }

    if (errors.length > 0) {
      this.errors = errors.length ? errors : undefined;
    }
  }

  static parse(row: string, fieldInfo: Array<[number, number, string]>): Row {
    const fields: { [key: string]: string } = {};
    fieldInfo.forEach(([start, end, name]) => {
      fields[name] = row.slice(start, end).trim();
    });
    const amount = parseFloat(fields['amount']);

    return new Row(
      fields['type'],
      new Date(fields['date']),
      fields['product'],
      amount,
      fields['seller'],
    );
  }
}
