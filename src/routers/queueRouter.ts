import express from 'express';

import { enterQueue, leaveQueue } from '../resolvers/queue';
import { statusBad } from '../utils';

const queueRouter = express.Router();

queueRouter.post('/enter', async (req, res) => {
  const playerID = req.body.playerID;
  const playerRating = req.body.playerRating;

  if (!playerID || !playerRating) {
    res.send(statusBad('bad request'));
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
