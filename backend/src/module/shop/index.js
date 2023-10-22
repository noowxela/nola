import { ShopTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  ShopTC.addResolver(resolvers[resolver])
}

export { ShopTC }
