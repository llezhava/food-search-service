## Set up local development

- `docker compose up -d`
- `npm i`
- `npx prisma db seed`
- `npm run start:dev`

## Query database

- `localhost:3000/search?term=potatoes in london or Manchester`

## What I would improve

- I would add unit tests to the `generateEntities` function
- During seeding I had to resort to `any` type, but data seems to be updating correctly
- Typescript type naming is not good enough, I would also update them
