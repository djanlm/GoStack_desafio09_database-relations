import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Não existe customer com o id passado.');
    }

    const ids = products.map(product => {
      return { id: product.id };
    });

    const foundProducts = await this.productsRepository.findAllById(ids);

    if (foundProducts.length !== products.length) {
      throw new AppError('Algum produto da lista não existe.');
    }
    foundProducts.forEach((product, index) => {
      if (product.quantity < products[index].quantity) {
        throw new AppError(
          `Não há qtd suficiente do produto ${product.name} para esse pedido.`,
        );
      }
    });

    // esse map serve pra usarmos apenas o product_id, price e quantity, pois o metodo create so aceita produtos com esses 3 dados apenas. Tb substitui a quantidade pela quantidade no pedido
    const filteredProducts = foundProducts.map((product, index) => ({
      product_id: product.id,
      price: product.price,
      quantity: products[index].quantity,
    }));
    await this.productsRepository.updateQuantity(products);

    const order = await this.ordersRepository.create({
      customer,
      products: filteredProducts,
    });

    return order;
  }
}

export default CreateOrderService;
