export class CreateProductsDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID
    public readonly category: string, // ID
  ) {}
  static create(object: { [key: string]: any }): [string?, CreateProductsDto?] {
    const { name, available, price, description, user, category } = object;
    if (!name) return ["Missing name"];
    if (!user) return ["Missing user"];
    if (!category) return ["Missing category"];

    return [
      undefined,
      new CreateProductsDto(
        name,
        !!available,
        price,
        description,
        user,
        category,
      ),
    ];
  }
}
