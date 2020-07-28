import { container } from 'tsyringe';

import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ProductsRepository from '@modules/products/infra/typeorm/repositories/ProductsRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';

container.registerSingleton<ICustomersRepository>( // registersingleton cria apenas uma instancia da classe, register criaria uma instancia sempre que fosse chamado
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>( // registersingleton cria apenas uma instancia da classe, register criaria uma instancia sempre que fosse chamado
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>( // registersingleton cria apenas uma instancia da classe, register criaria uma instancia sempre que fosse chamado
  'OrdersRepository',
  OrdersRepository,
);
