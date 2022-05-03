import express from 'express';

import { enterQueue, leaveQueue } from '../resolvers/queue';
import { statusBad } from '../utils';

const queueRouter = express.Router();

queueRouter.post('/enter', (req, res) => {
  const playerID = req.body.playerID;
  const playerRating = req.body.playerRating;

  if (!playerID || !playerRating) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(enterQueue({ playerID, playerRating }));
});

queueRouter.post('/leave', (req, res) => {
  const playerID = req.body.playerID;

  if (!playerID) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(leaveQueue({ playerID }));
});

export default queueRouter;
