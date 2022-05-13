import express from 'express';

import { enterQueue, leaveQueue } from '../resolvers/queue';
import { createMatch } from '../resolvers/match';
import { statusGood, statusBad } from '../utils';

const queueRouter = express.Router();

queueRouter.post('/enter', async (req, res) => {
  const playerID = req.body.playerID;
  const playerRating = req.body.playerRating;
  const computer = req.body.computer;

  console.log('-> entering queue ' + playerID + ' ' + computer);

  if (!playerID || !playerRating) {
    res.send(statusBad('bad request'));
    return;
  }

  if (computer) {
    res.send(statusGood);
    await createMatch({ player1ID: playerID, player2ID: 'computer' });
    return;
  } 

  res.send(await enterQueue({ playerID, playerRating }));
});

queueRouter.post('/leave', async (req, res) => {
  const playerID = req.body.playerID;

  console.log('-> leaving queue ' + playerID);

  if (!playerID) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(await leaveQueue({ playerID }));
});

export default queueRouter;
