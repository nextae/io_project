import {
  test as base,
  expect,
  BrowserContextOptions,
  Page,
} from "@playwright/test";
import { Client, randomUser, User } from "../util.js";

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

const test = base.extend<{
  apiClient: Client;
  randomPage: Page;
  randomUser: User;
  apiUrl: string;
}>({
  apiClient: async ({ apiUrl }, use) => {
    const client = new Client(apiUrl);
    await use(client);
  },
  randomPage: async ({ browser, baseURL, randomUser }, use) => {
    const context = await browser.newContext(
      userSession(randomUser, baseURL!)
    );
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  randomUser: async ({ apiClient }, use) => {
    const user = await apiClient.newUser(randomUser());
    await use(user);
  },
  apiUrl: ["http://localhost:8000/graphql", { option: true }],
});

test("log in", async ({ page, apiClient }) => {
  const userInfo = randomUser();
  await apiClient.newUser(userInfo);
  await page.goto("/");
  await page.getByRole("textbox", { name: "Username" }).type(userInfo.username);
  await page.getByRole("textbox", { name: "Password" }).type(userInfo.password);

  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForNavigation();

  await expect(
    page.getByRole("heading", { name: userInfo.username })
  ).toBeVisible();
});

test("create server", async ({ randomPage: page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create server" }).click();
  await page.getByLabel("Server name").fill("server name 1");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("link", { name: "server name 1" }).click();
  await expect(page.getByRole("banner").getByRole("heading")).toHaveText(
    "server name 1"
  );
});

test("create channel", async ({ randomPage: page, randomUser, apiClient }) => {
  await apiClient.createServer(randomUser, "server name 2");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page.getByRole("button", { name: "Create channel" }).click();
  await page.getByLabel("Channel name").fill("channel name 1");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("link", { name: "Channel name" })).toBeVisible();
});

test("invite user", async ({ browser, apiClient, baseURL }) => {
  const user1 = await apiClient.newUser(randomUser());
  const user2 = await apiClient.newUser(randomUser());
  await apiClient.createServer(user1, "server name 3");

  await test.step("send invite", async () => {
    const context1 = await browser.newContext(userSession(user1, baseURL!));
    const page1 = await context1.newPage();
    await page1.goto("/");
    await page1.getByRole("link", { name: "server name 3" }).click();
    await page1.getByRole("button", { name: "Invite user" }).click();
    await page1.getByRole("textbox", { name: "Username" }).fill(user2.username);
    await page1.getByRole("button", { name: "Invite" }).click();
    await expect(page1.getByRole("dialog")).not.toBeVisible();
    await context1.close();
  });

  await test.step("accept invite", async () => {
    const context2 = await browser.newContext(userSession(user2, baseURL!));
    const page2 = await context2.newPage();
    await page2.goto("/");
    await page2.getByRole("button", { name: "Account" }).click();
    await expect(page2.getByText("server name 3")).toBeVisible();
    await context2.close();
  });
});

test("send message", async ({ browser, apiClient, baseURL }) => {
  const { user1, user2 } =
    await test.step("setup users and server", async () => {
      const user1 = await apiClient.newUser(randomUser());
      const user2 = await apiClient.newUser(randomUser());
      const serverId = await apiClient.createServer(user1, "server name 4");
      await apiClient.createChannel(user1, serverId, "channel name 2");
      await apiClient.addMember(user1, user2, serverId);
      return { user1, user2 };
    });

  const context1 = await browser.newContext(userSession(user1, baseURL!));
  const context2 = await browser.newContext(userSession(user2, baseURL!));
  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  await test.step("send message", async () => {
    await page1.goto("/");
    await page2.goto("/");
    await page1.getByRole("link", { name: "server name 4" }).click();
    await page2.getByRole("link", { name: "server name 4" }).click();
    await page1.getByRole("link", { name: "channel name 2" }).click();
    await page2.getByRole("link", { name: "channel name 2" }).click();
    await page1.getByRole("textbox", { name: "Message" }).fill("Hello world!");
    await page1.getByRole("button", { name: "Send message" }).click();
  });

  await test.step("receive message", async () => {
    await expect(page2.getByText("Hello world!")).toBeVisible();
  });

  await context1.close();
  await context2.close();
});
