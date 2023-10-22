import { ShopCustomerTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  ShopCustomerTC.addResolver(resolvers[resolver])
}

export { ShopCustomerTC }
