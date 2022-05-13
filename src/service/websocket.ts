import axios from 'axios';

const url = 'http://websocket-server:3000';

type StartGameArgs =  {
  matchID: string, 
  player1ID: string,
  player2ID: string,
  player1Username: string
  player2Username: string
}

async function startGame(args: StartGameArgs) {
  const res = await axios.post(`${url}/startGame`, { data: args });
  return res.data;
}
