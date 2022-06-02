import prisma from '../../prisma/client';
import { statusBad, statusGood } from '../utils'

function createMatch(args: { player1ID: string, player2ID: string }) {
  return prisma.match.create({
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
      moves: true,
      boards: true
    }
  })

  if (!match)
    return statusBad('match doesn\'t exist');

  const board = args.state.substring(0, args.state.indexOf(' '));
  console.log(board);

  let result: string | null = null;

  let count = 1;
  for (const pastBoard of match.boards) {
    if (board === pastBoard) {
      count += 1;
      if (count === 3) {
        result = 'DRAW';
        break;
      }
    }
  }
  
  console.log(result);

  return await prisma.match.update({
    where: { id: args.id },
    data: {
      toMove: !match.toMove,
      state: args.state,
      moves: [...match.moves, args.move],
      boards: [...match.boards, board]
    }
  }).then(() => {
    return { ...statusGood, result };
  }).catch(exception => {
    console.warn(exception);
    return statusBad('unknown error'); 
  });
}

function getMatchWithPlayer(args: { playerID: string }) {
  return prisma.match.findFirst({
    where: {
      OR: [
        { player1ID: args.playerID },
        { player2ID: args.playerID }
      ],
    }
  });
}

function getMatch(args: { id: string }) {
  return prisma.match.findUnique({where: { id: args.id }})
}

function getMatches() {
  return prisma.match.findMany();
}

function getAndDeleteMatch(args: { id: string }) {
  return prisma.match.delete({where: { id: args.id }})
}

export { createMatch, getMatches, getMatch, getMatchWithPlayer, getAndDeleteMatch, updateMatch }
