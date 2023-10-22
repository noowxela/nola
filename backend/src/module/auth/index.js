import { UserTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  UserTC.addResolver(resolvers[resolver])
}

export { UserTC }