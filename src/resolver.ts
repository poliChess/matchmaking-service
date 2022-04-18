import { enterQueue, leaveQueue } from './resolvers/queue';
import { getMatch, getMatchWithPlayer, getMatches, updateMatch } from './resolvers/match';
import { getHistory } from './resolvers/history';

const resolver = {
  running: () => "yes",

  enterQueue: enterQueue,
  leaveQueue: leaveQueue,

  match: getMatch,
  matchWithPlayer: getMatchWithPlayer,
  matches: getMatches,
  updateMatch: updateMatch,

  history: getHistory,
}

export default resolver;
