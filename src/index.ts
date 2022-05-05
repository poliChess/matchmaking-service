import express from 'express';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from '../graphql/schema';
import graphqlResolver from './resolver';

import matchRouter from './routers/matchRouter';
import queueRouter from './routers/queueRouter';

function main() {
  const server = express();
  server.use(bodyParser.json());

  server.get('/running', (_ ,res) => {
    res.send("yes");
  });

  server.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
  }));

  server.use('/match', matchRouter);
  server.use('/queue', queueRouter);

  server.listen(3000, () => { 
    console.log("matchmaking service started")
  });
}

main()
