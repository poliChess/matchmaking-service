import express from 'express';

import { getMatches, updateMatch } from '../resolvers/match';
import { getHistory } from '../resolvers/history';
import { statusBad } from '../utils';

const matchRouter = express.Router();

matchRouter.get('/current', (_, res) => {
  res.send(getMatches());
});

matchRouter.post('/update', (req, res) => {
  const id    = req.body.id;
  const move  = req.body.move;
  const state = req.body.state;

  if (!id || !move || !state) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(updateMatch({ id, move, state }));
});

matchRouter.get('/history', (req, res) => {
  const playerID = req.body.playerID;
  const after  = req.body.after;
  const before = req.body.before;

  if (!playerID) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(getHistory({ playerID, after, before }));
});



export default matchRouter;
