import { getQueued, leaveQueue } from './resolvers/queue';
import { startGame } from './service/websocket';
import { getUsername } from './service/user';
import { createMatch } from './resolvers/match';

type Player = { playerID: string, rating: number, enteredAt: Date }

let toggle = true;

async function matchmake() {
  let queue = await getQueued();

  console.log(`players in queue: ${queue.map(x => JSON.stringify({ id: x.playerID, rating: x.rating}))}`);
  
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
  console.log('matched! \n -> ' + JSON.stringify(player1) + '\n -> ' + JSON.stringify(player2));
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
    player1Username: await getUsername(match.player1ID),
    player2ID: match.player2ID,
    player2Username: await getUsername(match.player2ID)
  });
}

export default matchmake;



