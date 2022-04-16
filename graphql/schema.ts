import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';

const schema = buildSchema(readFileSync('./graphql/schema.graphql').toString());

export default schema;
