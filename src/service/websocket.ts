import axios from 'axios';

const url = 'http://websocket-server:3000';

type StartGameArgs =  {
  matchID: string, 
  player1ID: string,
  player2ID: string
}

async function startGame(args: StartGameArgs) {
  const res = await axios.post(`${url}/startGame`, args);
  return res.data;
}

export { startGame }
