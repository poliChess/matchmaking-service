import prisma from '../../prisma/client';

function parseDate(arg: string) {
  const date = new Date(arg);
  if (isNaN(date.getTime()))
    return { valid: false }

  return { valid: true, value: date }
}

async function getHistory(args: { playerID: string, after: string, before: string }) {
  let timeQuery: any = {};

  const after = parseDate(args.after);
  if (after.valid)
    timeQuery.gt = after.value;

  const before = parseDate(args.before);
  if (before.valid)
    timeQuery.lt = before.value;

  return await prisma.history.findMany({
    where: {
      OR: [
        { player1ID: args.playerID },
        { player2ID: args.playerID }
      ],
      finishedAt: timeQuery
    }
  });
}

async function insertInHistory(data: { 
    player1ID: string,
    player2ID: string,
    winner: 'NONE' | 'STALEMATE' | 'DRAW' | 'PLAYER1' | 'PLAYER2',
    state: string,
    moves: string[],
    startedAt: Date
  }) {
  
  await prisma.history.create({ data: data });
}

export { getHistory, insertInHistory }
