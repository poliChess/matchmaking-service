import { getQueued, leaveQueue } from './resolvers/queue';
import { startGame } from './service/websocket';
import { createMatch } from './resolvers/match';

type Player = { playerID: string, rating: number, enteredAt: Date }

let toggle = true;

async function matchmake() {
  let queue = await getQueued();

  if (toggle)
    matchAscending(queue);
  else
    matchDescending(queue);

  toggle = !toggle;
}

function matchAscending(queue: Player[]) {
  for (let i = 0; i < queue.length - 1; i++) {
    const ratingDiff = Math.abs(queue[i].rating - queue[i + 1].rating);

    if (ratingDiff < 50) {
      matchPlayers(queue[i], queue[i + 1]);
      i += 1;
    } else {
      const waitedFor = (Date.now() - queue[i].enteredAt.getTime()) / 1000;
      if (waitedFor > 20 && (waitedFor - 15) ** 2 > ratingDiff) {
        matchPlayers(queue[i], queue[i + 1]);
        i += 1;
      }
    }
  }
}

function matchDescending(queue: Player[]) {
  for (let i = queue.length - 1; i > 0; i--) {
    const ratingDiff = Math.abs(queue[i].rating - queue[i - 1].rating);

    if (ratingDiff < 50) {
      matchPlayers(queue[i], queue[i - 1]);
      i -= 1;
    } else {
      const waitedFor = (Date.now() - queue[i].enteredAt.getTime()) / 1000;
      if (waitedFor > 20 && (waitedFor - 15) ** 2 > ratingDiff) {
        matchPlayers(queue[i], queue[i - 1]);
        i -= 1;
      }
    }
  }
}

async function matchPlayers(player1: Player, player2: Player) {
  leaveQueue({ playerID: player1.playerID });
  leaveQueue({ playerID: player2.playerID });

  const players = Math.random() > 0.5 ? [player1, player2] : [player2, player1];

  const match = await createMatch({
    player1ID: players[0].playerID,
    player2ID: players[1].playerID
  });

  await startGame({
    matchID: match.id,
    player1ID: match.player1ID,
    player2ID: match.player2ID,
  });
}

export default matchmake;



