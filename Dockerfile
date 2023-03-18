FROM node:18 as base

RUN mkdir -p /app
WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install --omit=dev
RUN npx prisma generate

CMD npx prisma db push ; npm run prod
