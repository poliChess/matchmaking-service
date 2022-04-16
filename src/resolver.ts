import { enterQueue, leaveQueue } from './resolvers/queue';
import { getMatch, getMatches, updateMatch } from './resolvers/match';
import { getHistory } from './resolvers/history';

const resolver = {
  match: getMatch,
  matches: getMatches,
  history: getHistory,

  enter: enterQueue,
  leave: leaveQueue,
  updateMatch: updateMatch
}

export default resolver;
