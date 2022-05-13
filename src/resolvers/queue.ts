import prisma from '../../prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { statusGood, statusBad } from '../utils';

async function enterQueue(args: { playerID: string, playerRating: number }) {
  return await prisma.queue.create({ 
      data: {
        playerID: args.playerID,
        rating: args.playerRating
      }
  }).then(() => {
      return statusGood;
  }).catch(exception => {
      if (exception instanceof PrismaClientKnownRequestError) {
        if (exception.code == 'P2002')
          return statusBad('user already in queue');

        return statusBad(exception.code);
      }
      return statusBad('unknown error');
  });
};

async function leaveQueue(args: { playerID: string }) {
  return await prisma.queue.delete({
    where: { playerID: args.playerID }
  }).then(() => {
      return statusGood;
  }).catch(exception => {
      if (exception instanceof PrismaClientKnownRequestError) {
        if (exception.code == 'P2025')
          return statusBad('user not in queue');

        return statusBad(exception.code);
      }
      return statusBad('unknown error');
  });
}

async function getQueued() {
  return prisma.queue.findMany({ orderBy: { rating: 'asc' } });
}

export { enterQueue, leaveQueue, getQueued }
