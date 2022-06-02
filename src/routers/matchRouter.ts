import express from 'express';

import { getMatches, getMatchWithPlayer, updateMatch, getAndDeleteMatch } from '../resolvers/match';
import { getHistory, insertInHistory } from '../resolvers/history';
import { statusBad, statusGood } from '../utils';

const matchRouter = express.Router();

matchRouter.get('/current', async (req, res) => {
  const playerID = req.body.playerID; 

  if (playerID)
    return res.send(await getMatchWithPlayer({ playerID }));

  return res.send(await getMatches());
});

matchRouter.post('/update', async (req, res) => {
  const id    = req.body.id;
  const move  = req.body.move;
  const state = req.body.state;

  if (!id || !move || !state) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(await updateMatch({ id, move, state }));
});

matchRouter.post('/end', async (req, res) => {
  const id = req.body.id;
  const result = req.body.result;

  if (!id || !result) {
    res.send(statusBad('bad request'));
    return;
  }

  const match = await getAndDeleteMatch({ id });

  if (!match) {
    res.send(statusBad('bad match'));
    return;
  }

  const { type, player1ID, player2ID, state, moves, startedAt } = match;

  await insertInHistory({
    type,
    player1ID,
    player2ID,
    state,
    moves,
    winner: result.toUpperCase(),
    startedAt
  });
  
  res.send(statusGood);
})

matchRouter.get('/history', async (req, res) => {
  const playerID = req.body.playerID;
  const after  = req.body.after;
  const before = req.body.before;

  if (!playerID) {
    res.send(statusBad('bad request'));
    return;
  }

  res.send(await getHistory({ playerID, after, before }));
});

export default matchRouter;
