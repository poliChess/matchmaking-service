import prisma from '../../prisma/client';
import { statusBad, statusGood } from '../utils'

async function createMatch(args: { player1ID: string, player2ID: string }) {
  return await prisma.match.create({
    data: {
      player1ID: args.player1ID,
      player2ID: args.player2ID,
      type: args.player2ID == 'computer' ? "COMPUTER" : "NORMAL",
      toMove: false
    }
  });
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

async function getAndDeleteMatch(args: { id: string }) {
  return await prisma.match.delete({where: { id: args.id }})
}

export { createMatch, getMatches, getMatch, getMatchWithPlayer, getAndDeleteMatch, updateMatch }
