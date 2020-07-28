import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);
    const foundProducts = await this.ormRepository.find({
      where: { id: In(ids) },
    });

    return foundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => product.id); // cria array so com ids
    const quantities = products.map(product => product.quantity); // cria array so com as quantidades
    const foundProducts = await this.ormRepository.find({ where: In(ids) }); // retorna lista de todos os produtos com os ids passados

    const updatedProducts = foundProducts.map((foundProduct, index) => {
      // atualiza todos os produtos
      return {
        ...foundProduct,
        quantity: foundProduct.quantity - quantities[index],
      };
      // foundProduct.quantity -= quantities[index];
      // return foundProduct;
    });

    // salva todosos produtos
    updatedProducts.forEach(updatedProduct =>
      this.ormRepository.save(updatedProduct),
    );

    return updatedProducts;
  }
}

export default ProductsRepository;
