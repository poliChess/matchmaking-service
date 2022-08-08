import 'isomorphic-unfetch';
import express from 'express';
import bodyParser from 'body-parser';

import discovery from './grpc/discovery';

import matchRouter from './routers/matchRouter';
import queueRouter from './routers/queueRouter';
import matchmake from './matchmake';

function main() {
  const server = express();
  server.use(bodyParser.json());

  server.get('/running', (_, res) => {
    res.send("yes");
  });

  server.use('/match', matchRouter);
  server.use('/queue', queueRouter);

  server.listen(3000, () => {
    console.log("matchmaking service started")
  });

  setInterval(() => matchmake(), 3000);

  discovery.register('matchmaking-service', 'matchmaking-service:3000');
}

main()
