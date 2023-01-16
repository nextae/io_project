import { test as base, BrowserContextOptions, Page } from "@playwright/test";
import { Client, randomUser as createRandomUser, User } from "./util.js";

function userSession(user: User, url: string): BrowserContextOptions {
  return {
    storageState: {
      cookies: [],
      origins: [
        {
          origin: url,
          localStorage: [
            {
              name: "token",
              value: user.token,
            },
            {
              name: "userId",
              value: user.id.toString(),
            },
          ],
        },
      ],
    },
  };
}

export const test = base.extend<{
  apiClient: Client;
  randomPage: Page;
  randomUser: User;
  randomPage2: Page;
  randomUser2: User;
  apiUrl: string;
}>({
  apiClient: async ({ apiUrl }, use) => {
    const client = new Client(apiUrl);
    await use(client);
  },
  randomPage: async ({ browser, baseURL, randomUser }, use) => {
    const context = await browser.newContext(userSession(randomUser, baseURL!));
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  randomUser: async ({ apiClient }, use) => {
    const user = await apiClient.newUser(createRandomUser());
    await use(user);
  },
  randomPage2: async ({ browser, baseURL, randomUser2 }, use) => {
    const context = await browser.newContext(
      userSession(randomUser2, baseURL!)
    );
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  randomUser2: async ({ apiClient }, use) => {
    const user = await apiClient.newUser(createRandomUser());
    await use(user);
  },
  apiUrl: ["http://localhost:8000/graphql", { option: true }],
});
