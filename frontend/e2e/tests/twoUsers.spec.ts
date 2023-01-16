import { expect } from "@playwright/test";
import { test } from "../fixtures.js";

test("when a user sends an invite, another user receives it and is able to accept it", async ({
  randomPage: page1,
  randomPage2: page2,
  randomUser: user1,
  randomUser2: user2,
  apiClient,
}) => {
  await apiClient.createServer(user1, "server name 3");

  await test.step("first user sends an invite", async () => {
    await page1.goto("/");
    await page1.getByRole("link", { name: "server name 3" }).click();
    await page1.getByRole("button", { name: "Invite user" }).click();
    await page1.getByRole("textbox", { name: "Username" }).fill(user2.username);
    await page1
      .getByRole("textbox", { name: "Invitation content" })
      .fill("Invitation content");
    await page1.getByRole("button", { name: "Invite" }).click();
    await expect(page1.getByRole("dialog")).not.toBeVisible();
  });

  await test.step("second user accepts the invite", async () => {
    await page2.goto("/account");
    await expect(page2.getByText("server name 3")).toBeVisible();
    await page2.getByRole("button", { name: "Accept invitation" }).click();
    await expect(
      page2.getByRole("link", { name: "server name 3" })
    ).toBeVisible();
  });
});

test("when a user sends an invite, another user receives it and is able to decline it", async ({
  randomPage: page1,
  randomPage2: page2,
  randomUser: user1,
  randomUser2: user2,
  apiClient,
}) => {
  await apiClient.createServer(user1, "server name 3");

  await test.step("first user sends an invite", async () => {
    await page1.goto("/");
    await page1.getByRole("link", { name: "server name 3" }).click();
    await page1.getByRole("button", { name: "Invite user" }).click();
    await page1.getByRole("textbox", { name: "Username" }).fill(user2.username);
    await page1
      .getByRole("textbox", { name: "Invitation content" })
      .fill("Invitation content");
    await page1.getByRole("button", { name: "Invite" }).click();
    await expect(page1.getByRole("dialog")).not.toBeVisible();
  });

  await test.step("second user declines the invite", async () => {
    await page2.goto("/account");
    await expect(page2.getByText("server name 3")).toBeVisible();
    await page2.getByRole("button", { name: "Decline invitation" }).click();
    await expect(page2.getByText("server name 3")).not.toBeVisible();
  });
});

test("when a user sends a message, another user immediately receives it", async ({
  randomPage: page1,
  randomPage2: page2,
  randomUser: user1,
  randomUser2: user2,
  apiClient,
}) => {
  const serverId = await apiClient.createServer(user1, "server name 4");
  await apiClient.createChannel(user1, serverId, "channel name 2");
  await apiClient.addMember(user1, user2, serverId);

  await test.step("both users navigate to the chat", async () => {
    await page1.goto("/");
    await page2.goto("/");
    await page1.getByRole("link", { name: "server name 4" }).click();
    await page2.getByRole("link", { name: "server name 4" }).click();
    await page1.getByRole("link", { name: "channel name 2" }).click();
    await page2.getByRole("link", { name: "channel name 2" }).click();
  });

  await test.step("first user sends a message", async () => {
    await page1.getByRole("textbox", { name: "Message" }).fill("Hello world!");
    await page1.getByRole("button", { name: "Send message" }).click();
  });

  await test.step("second user receives the message", async () => {
    await expect(page2.getByText("Hello world!")).toBeVisible({
      timeout: 10000,
    });
  });
});

test("when the owner changes the server name, a member is immediately able to see the new name", async ({
  randomPage: page1,
  randomPage2: page2,
  randomUser: owner,
  randomUser2: member,
  apiClient,
}) => {
  const serverId = await apiClient.createServer(owner, "server name 5");
  await apiClient.addMember(owner, member, serverId);

  await test.step("both users navigate to the server", async () => {
    await page1.goto("/");
    await page2.goto("/");
    await page1.getByRole("link", { name: "server name 5" }).click();
    await page2.getByRole("link", { name: "server name 5" }).click();
  });

  await test.step("owner changes the server name", async () => {
    await page1.getByRole("button", { name: "Rename server" }).click();
    await page1.getByRole("textbox", { name: "Server name" }).fill("new name");
    await page1.getByRole("button", { name: "Save" }).click();
    await expect(page1.getByRole("dialog")).not.toBeVisible();
  });

  await test.step("member sees the new name", async () => {
    await expect(page2.getByRole("banner").getByRole("heading")).toHaveText(
      "new name"
    );
    await expect(page2.getByText("server name 5")).not.toBeVisible();
  });

  await test.step("owner sees the new name", async () => {
    await expect(page1.getByRole("banner").getByRole("heading")).toHaveText(
      "new name"
    );
    await expect(page1.getByText("server name 5")).not.toBeVisible();
  });
});

test("when the owner changes the channel name, a member is immediately able to see the new name", async ({
  randomPage: page1,
  randomPage2: page2,
  randomUser: owner,
  randomUser2: member,
  apiClient,
}) => {
  const serverId = await apiClient.createServer(owner, "server name 6");
  await apiClient.createChannel(owner, serverId, "channel name 3");
  await apiClient.addMember(owner, member, serverId);

  await test.step("both users navigate to the server", async () => {
    await page1.goto("/");
    await page2.goto("/");
    await page1.getByRole("link", { name: "server name 6" }).click();
    await page2.getByRole("link", { name: "server name 6" }).click();
  });

  await test.step("owner changes the channel name", async () => {
    await page1
      .getByRole("listitem")
      .filter({ hasText: "channel name 3" })
      .getByRole("button")
      .click();
    await page1.getByRole("menuitem", { name: "Change name" }).click();
    await page1.getByRole("textbox").fill("new name");
    await page1.getByRole("button", { name: "Save" }).click();
    await expect(page1.getByRole("dialog")).not.toBeVisible();
  });

  await test.step("member sees the new name", async () => {
    await expect(page2.getByRole("link", { name: "new name" })).toBeVisible();
    await expect(page2.getByText("channel name 3")).not.toBeVisible();
  });

  await test.step("owner sees the new name", async () => {
    await expect(page1.getByRole("link", { name: "new name" })).toBeVisible();
    await expect(page1.getByText("channel name 3")).not.toBeVisible();
  });
});

