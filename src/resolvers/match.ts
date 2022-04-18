import prisma from '../../prisma/client';
import { statusBad, statusGood } from '../utils'

async function createMatch(player1ID: string, player2ID: string) {
  await prisma.match.create({
    data: {
      player1ID: player1ID,
      player2ID: player2ID,
      toMove: true
    }
  }).catch(exception => {
    console.log(exception);
  })
}

async function updateMatch(args: { id: string, state: string, move: string }) {
  let match = await prisma.match.findUnique({
    where: { id: args.id },
    select: {
      toMove: true,
      moves: true
    }
  })

  if (!match)
    return statusBad('match doesn\'t exist');

  return await prisma.match.update({
    where: { id: args.id },
    data: {
      toMove: !match.toMove,
      state: args.state,
      moves: [...match.moves, args.move]
    }
  }).then(() => {
    return statusGood;
  }).catch(exception => {
    console.warn(exception);
    return statusBad('unknown error'); 
  });
}

async function getMatchWithPlayer(args: { playerID: string }) {
  return await prisma.match.findFirst({
    where: {
      OR: [
        { player1ID: args.playerID },
        { player2ID: args.playerID }
      ],
    }
  });
}

async function getMatch(args: { id: string }) {
  return await prisma.match.findUnique({where: { id: args.id }})
}

async function getMatches() {
  return await prisma.match.findMany();
}

export { createMatch, getMatches, getMatch, getMatchWithPlayer, updateMatch }
