import { EventTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  EventTC.addResolver(resolvers[resolver])
}

export { EventTC }
