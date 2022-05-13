import { createClient } from "@urql/core";

const client = createClient({
  url: 'http://user-service:3000/graphql'
})

async function getUsername(id: string) {
  const res = await client.query(
    `query($id: ID!) {
      user(id: $id) {
        username
      }
    }`,
    { id }
  ).toPromise();
  return res.data.user.username;
}

export { getUsername }
