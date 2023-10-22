import { LeaderboardTC } from './types.js';
import { resolvers } from './resolvers.js';

for (const resolver in resolvers) {
  LeaderboardTC.addResolver(resolvers[resolver])
}

export { LeaderboardTC }
