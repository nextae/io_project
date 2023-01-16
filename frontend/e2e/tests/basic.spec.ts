import { expect } from "@playwright/test";
import { randomUser as createRandomUser } from "../util.js";
import { test } from "../fixtures.js";

test("user is able to log in", async ({ page, apiClient }) => {
  const userInfo = createRandomUser();
  await apiClient.newUser(userInfo);
  await page.goto("/");
  await page.getByRole("textbox", { name: "Username" }).type(userInfo.username);
  await page.getByRole("textbox", { name: "Password" }).type(userInfo.password);

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(
    page.getByRole("heading", { name: userInfo.username })
  ).toBeVisible();
});

test("user is able to log out", async ({ randomPage: page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log out" }).click();

  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("user is able to change password", async ({
  randomPage: page,
  randomUser,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Account" }).click();
  await page.getByRole("button", { name: "Change password" }).click();
  await page
    .getByRole("textbox", { name: "Current password" })
    .type(randomUser.password);
  await page
    .getByRole("textbox", { name: "New password" })
    .first()
    .type("new password");
  await page
    .getByRole("textbox", { name: "Confirm new password" })
    .type("new password");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("user is able to create a server", async ({ randomPage: page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create server" }).click();
  await page.getByLabel("Server name").fill("server name 1");
  await page.getByRole("button", { name: "Create" }).click();
  await page.getByRole("link", { name: "server name 1" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByRole("banner").getByRole("heading")).toHaveText(
    "server name 1"
  );
});

test("owner is able to rename a server", async ({
  randomPage: page,
  apiClient,
  randomUser,
}) => {
  await apiClient.createServer(randomUser, "server name 2");
  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page.getByRole("button", { name: "Rename server" }).click();
  await page
    .getByRole("textbox", { name: "Server name" })
    .fill("New server name");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByRole("banner").getByRole("heading")).toHaveText(
    "New server name"
  );
});

test("owner is able to delete a server", async ({
  randomPage: page,
  apiClient,
  randomUser,
}) => {
  await apiClient.createServer(randomUser, "server name 2");
  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page.getByRole("button", { name: "Delete server" }).click();
  await page.getByRole("textbox").fill("server name 2");
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(
    page.getByRole("link", { name: "server name 2" })
  ).not.toBeVisible();
});

test("owner is able to create a channel", async ({
  randomPage: page,
  randomUser,
  apiClient,
}) => {
  await apiClient.createServer(randomUser, "server name 2");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page.getByRole("button", { name: "Create channel" }).click();
  await page.getByLabel("Channel name").fill("channel name 1");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByRole("link", { name: "Channel name" })).toBeVisible();
});

test("owner is able to rename a channel", async ({
  randomPage: page,
  randomUser,
  apiClient,
}) => {
  const server = await apiClient.createServer(randomUser, "server name 2");
  await apiClient.createChannel(randomUser, server, "channel name 1");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "channel name 1" })
    .getByRole("button")
    .click();
  await page.getByRole("menuitem", { name: "Change name" }).click();
  await page.getByRole("textbox").fill("New channel name");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(
    page.getByRole("link", { name: "New channel name" })
  ).toBeVisible();
});

test("owner is able to delete a channel", async ({
  randomPage: page,
  randomUser,
  apiClient,
}) => {
  const server = await apiClient.createServer(randomUser, "server name 2");
  await apiClient.createChannel(randomUser, server, "channel name 1");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "channel name 1" })
    .getByRole("button")
    .click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete" }).click();

  await expect(
    page.getByRole("link", { name: "channel name 1" })
  ).not.toBeVisible();
});

test("owner is able to kick a member", async ({
  randomPage: page,
  randomUser: owner,
  apiClient,
}) => {
  const server = await apiClient.createServer(owner, "server name 2");
  const user = await apiClient.newUser(createRandomUser());
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, user, server);

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page.getByRole("link", { name: "channel name 1" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: user.username })
    .getByRole("button")
    .click();
  await page.getByRole("menuitem", { name: "Kick member" }).click();
  await page.getByRole("button", { name: "Kick" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(
    page.getByRole("link", { name: user.username })
  ).not.toBeVisible();
});

test("owner is able to promote a member to a moderator", async ({
  randomPage: page,
  randomUser: owner,
  apiClient,
}) => {
  const server = await apiClient.createServer(owner, "server name 2");
  const user = await apiClient.newUser(createRandomUser());
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, user, server);

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: user.username })
    .getByRole("button")
    .click();
  await page.getByRole("menuitem", { name: "Change role" }).click();
  await page.getByRole("combobox").selectOption("moderator");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByText(`${user.username} (moderator)`)).toBeVisible();
});

test("when the owner promotes another member to an owner, the previous owner is demoted to a moderator", async ({
  randomPage: page,
  randomUser: owner,
  apiClient,
}) => {
  const server = await apiClient.createServer(owner, "server name 2");
  const user = await apiClient.newUser(createRandomUser());
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, user, server);

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: user.username })
    .getByRole("button")
    .click();
  await page.getByRole("menuitem", { name: "Change role" }).click();
  await page.getByRole("combobox").selectOption("owner");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByText(`${user.username} (owner)`)).toBeVisible();
  await expect(page.getByText(`${owner.username} (moderator)`)).toBeVisible();
});

test("owner is able to demote a moderator to a member", async ({
  randomPage: page,
  randomUser: owner,
  apiClient,
}) => {
  const server = await apiClient.createServer(owner, "server name 2");
  const user = await apiClient.newUser(createRandomUser());
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, user, server);
  await apiClient.changeMemberRole(owner, user, server, "MODERATOR");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 2" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: user.username })
    .getByRole("button")
    .click();

  await page.getByRole("menuitem", { name: "Change role" }).click();
  await page.getByRole("combobox").selectOption("member");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(page.getByText(`${user.username}`)).toBeVisible();
  await expect(
    page.getByText(`${user.username} (moderator)`)
  ).not.toBeVisible();
});

test("user is able to search for a server", async ({
  randomPage: page,
  randomUser: user,
  apiClient,
}) => {
  await apiClient.createServer(user, "server name 1");
  await apiClient.createServer(user, "server name 2");

  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Search servers" })
    .type("server name 1");

  await expect(page.getByText("server name 1")).toBeVisible();
  await expect(page.getByText("server name 2")).not.toBeVisible();
});

test("member is unable to edit a server", async ({
  randomPage: page,
  randomUser: member,
  apiClient,
}) => {
  const owner = await apiClient.newUser(createRandomUser());
  const server = await apiClient.createServer(owner, "server name 1");
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, member, server);

  await page.goto("/");
  await page.getByRole("link", { name: "server name 1" }).click();

  await expect(
    page.getByRole("button", { name: "Delete server" })
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Rename server" })
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Invite user" })
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Channel menu" })
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Member menu" })
  ).not.toBeVisible();
});

test("owner is unable to leave the server", async ({
  randomPage: page,
  randomUser: owner,
  apiClient,
}) => {
  const server = await apiClient.createServer(owner, "server name 1");
  await apiClient.createChannel(owner, server, "channel name 1");

  await page.goto("/");
  await page.getByRole("link", { name: "server name 1" }).click();

  await expect(
    page.getByRole("menuitem", { name: "Leave server" })
  ).not.toBeVisible();
});

test("member is able to leave a server", async ({
  randomPage: page,
  randomUser: member,
  apiClient,
}) => {
  const owner = await apiClient.newUser(createRandomUser());
  const server = await apiClient.createServer(owner, "server name 1");
  await apiClient.createChannel(owner, server, "channel name 1");
  await apiClient.addMember(owner, member, server);

  await page.goto("/");
  await page.getByRole("link", { name: "server name 1" }).click();
  await page.getByRole("menuitem", { name: "Leave server" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Leave" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(
    page.getByRole("link", { name: "server name 1" })
  ).not.toBeVisible();
});
