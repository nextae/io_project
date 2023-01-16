import { faker } from "@faker-js/faker";
import {
  Client,
  randomUser,
  sendRandomMessage,
  createRandomServer,
} from "./util";

async function main(url: string) {
  const client = new Client(url);
  const userInfos = Array.from({ length: 20 }).map(() => randomUser());
  const users = await Promise.all(
    userInfos
      .map((user) => client.newUser(user).catch(() => null!))
      .filter((user) => user !== null)
  );
  console.log(users);
  const owners = faker.helpers.arrayElements(users, 20);
  const servers = await Promise.all(
    owners.map((owner) =>
      createRandomServer(
        client,
        owner,
        faker.helpers.arrayElements(
          users,
          faker.datatype.number({ min: 5, max: 50 })
        )
      ).catch(console.error)
    )
  );
  console.log(servers);

  for (const server of servers) {
    // await Promise.all(
    // Array.from({ length: 500 }).map(async () => {
    for (let i = 0; i < 500; i++) {
      await sendRandomMessage(
        client,
        server.server,
        server.channels,
        server.members
      ).catch(console.error);
    }
    // })
    // );
  }
}

console.log(import.meta.env.VITE_API_URL);
await main(import.meta.env.VITE_API_URL);
