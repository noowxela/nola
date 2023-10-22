import { GameHistoryTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  GameHistoryTC.addResolver(resolvers[resolver])
}

export { GameHistoryTC }
