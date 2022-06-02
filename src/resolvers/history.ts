import prisma from '../../prisma/client';

function parseDate(arg: string) {
  const date = new Date(arg);
  if (isNaN(date.getTime()))
    return { valid: false }

  return { valid: true, value: date }
}

function getHistory(args: { playerID: string, after: string, before: string }) {
  let timeQuery: any = {};

  const after = parseDate(args.after);
  if (after.valid)
    timeQuery.gt = after.value;

  const before = parseDate(args.before);
  if (before.valid)
    timeQuery.lt = before.value;

  return prisma.history.findMany({
    where: {
      OR: [
        { player1ID: args.playerID },
        { player2ID: args.playerID }
      ],
      finishedAt: timeQuery
    }
  });
}

async function insertInHistory(data: any) {
  await prisma.history.create({ data });
}

export { getHistory, insertInHistory }
