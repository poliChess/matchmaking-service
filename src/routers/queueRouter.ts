import express from 'express';

import { enterQueue, leaveQueue } from '../resolvers/queue';
import { createMatch } from '../resolvers/match';
import { startGame } from '../service/websocket';
import { statusGood, statusBad } from '../utils';

const queueRouter = express.Router();

queueRouter.post('/enter', async (req, res) => {
  const playerID = req.body.playerID;
  const playerRating = req.body.playerRating;
  const computer = req.body.computer;

  if (!playerID || !playerRating) {
    res.send(statusBad('bad request'));
    return;
  }

  if (computer) {
    res.send(statusGood);
    const match = await createMatch({ player1ID: playerID, player2ID: 'computer' });

    await startGame({
      matchID: match.id,
      player1ID: playerID,
      player2ID: 'computer',
    });

    return;
  } 

  res.send(await enterQueue({ playerID, playerRating }));
});

queueRouter.post('/leave', async (req, res) => {
  const playerID = req.body.playerID;

  if (!playerID) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(await leaveQueue({ playerID }));
});

export default queueRouter;
