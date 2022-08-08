import axios from 'axios';

import discovery from '../grpc/discovery';

let addr: string | null = null;
const serviceAddr = async () => {
  while (!addr) {
    const res = await discovery.get('websocket-server');

    if (res.status.success) {
      addr = res.service.serviceAddr;
    } else {
      console.warn(res.status.message);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return addr;
};

type StartGameArgs = {
  matchID: string,
  player1ID: string,
  player2ID: string
}

async function startGame(args: StartGameArgs) {
  const res = await axios.post(`http://${await serviceAddr()}/startGame`, args);
  return res.data;
}

export { startGame }
