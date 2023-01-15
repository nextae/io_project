import { faker } from "@faker-js/faker";
import { createClient } from "urql";

export const LogInMutation = /* GraphQL */ `
  mutation LogInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      __typename
      ... on Error {
        message
      }
      ... on AuthPayload {
        user {
          id
        }
        token
      }
    }
  }
`;

export const SendMessageMutation = /* GraphQL */ `
  mutation SendMessageMutation(
    $channelId: Int!
    $serverId: Int!
    $content: String!
  ) {
    addMessage(channelId: $channelId, serverId: $serverId, content: $content) {
      __typename
      ... on Error {
        message
      }
      ... on Message {
        id
      }
    }
  }
`;

export const RegistrationMutation = /* GraphQL */ `
  mutation RegistrationMutation(
    $username: String!
    $password: String!
    $email: String!
  ) {
    register(username: $username, password: $password, email: $email) {
      __typename
      ... on Error {
        message
      }
      ... on AuthPayload {
        user {
          id
        }
        token
      }
    }
  }
`;

export const CreateChannelMutation = /* GraphQL */ `
  mutation CreateChannelMutation($name: String!, $serverId: Int!) {
    addChannel(name: $name, serverId: $serverId) {
      __typename
      ... on Channel {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`;

export const CreateServerMutation = /* GraphQL */ `
  mutation CreateServerMutation($name: String!) {
    addServer(name: $name) {
      __typename
      ... on Server {
        id
        name
      }
      ... on Error {
        message
      }
    }
  }
`;

export const InviteUserMutation = /* GraphQL */ `
  mutation InviteUserMutation(
    $userId: Int!
    $serverId: Int!
    $content: String!
  ) {
    inviteUser(userId: $userId, serverId: $serverId, content: $content) {
      __typename
      ... on Invitation {
        serverId
      }
      ... on Error {
        message
      }
    }
  }
`;

export const AcceptInvitationMutation = /* GraphQL */ `
  mutation AcceptInvitationMutation($serverId: Int!) {
    acceptInvitation(serverId: $serverId) {
      __typename
      ... on Invitation {
        serverId
        userId
      }
      ... on Error {
        message
      }
    }
  }
`;

const ChangeMemberRoleMutation = /* GraphQL */ `
  mutation ChangeMemberRoleMutation(
    $serverId: Int!
    $userId: Int!
    $newRole: Role!
  ) {
    changeMemberRole(serverId: $serverId, userId: $userId, newRole: $newRole) {
      __typename
      ... on Member {
        id
        serverId
        name
        role
      }
      ... on Error {
        message
      }
    }
  }
`;

export interface User {
  id: number;
  token: string;
  username: string;
}

export class Client {
  client: ReturnType<typeof createClient>;
  constructor(url: string) {
    this.client = createClient({ url });
  }

  async newUser(params: {
    username: string;
    password: string;
    email: string;
  }): Promise<User> {
    const result = await this.client
      .mutation(RegistrationMutation, params)
      .toPromise();
    if (result.data?.register.__typename !== "AuthPayload") {
      throw new Error(result.data?.register.message);
    }
    return {
      id: +result.data.register.user.id,
      token: result.data.register.token,
      username: params.username,
    };
  }

  async getUser(params: { username: string; password: string }): Promise<User> {
    const result = await this.client
      .mutation(LogInMutation, params)
      .toPromise();
    if (result.data?.login.__typename !== "AuthPayload") {
      throw new Error(result.data?.login.message);
    }
    return {
      id: +result.data.login.user.id,
      token: result.data.login.token,
      username: params.username,
    };
  }

  async addMember(from: User, to: User, server: number) {
    const invitation = await this.client
      .mutation(
        InviteUserMutation,
        { content: "test", serverId: server, userId: to.id },
        { fetchOptions: { headers: { authorization: `Bearer ${from.token}` } } }
      )
      .toPromise();

    if (invitation.data?.inviteUser.__typename !== "Invitation") {
      throw new Error(invitation.data?.inviteUser.message);
    }

    const accept = await this.client
      .mutation(
        AcceptInvitationMutation,
        { serverId: server },
        { fetchOptions: { headers: { authorization: `Bearer ${to.token}` } } }
      )
      .toPromise();

    if (accept.data?.acceptInvitation.__typename !== "Invitation") {
      throw new Error(accept.data?.acceptInvitation.message);
    }
  }

  async createServer(user: User, name: string) {
    const result = await this.client
      .mutation(
        CreateServerMutation,
        { name },
        { fetchOptions: { headers: { authorization: `Bearer ${user.token}` } } }
      )
      .toPromise();

    if (result.data?.addServer.__typename !== "Server") {
      throw new Error(result.data?.addServer.message);
    }

    return +result.data.addServer.id;
  }

  async createChannel(user: User, server: number, name: string) {
    const result = await this.client
      .mutation(
        CreateChannelMutation,
        { name, serverId: server },
        { fetchOptions: { headers: { authorization: `Bearer ${user.token}` } } }
      )
      .toPromise();

    if (result.data?.addChannel.__typename !== "Channel") {
      throw new Error(result.data?.addChannel.message);
    }

    return +result.data.addChannel.id;
  }

  async sendMessage(
    user: User,
    server: number,
    channel: number,
    message: string
  ) {
    const result = await this.client
      .mutation(
        SendMessageMutation,
        { content: message, channelId: channel, serverId: server },
        { fetchOptions: { headers: { authorization: `Bearer ${user.token}` } } }
      )
      .toPromise();

    if (result.data?.addMessage.__typename !== "Message") {
      throw new Error(result.data?.addMessage.message);
    }

    return +result.data.addMessage.id;
  }

  async changeMemberRole(
    owner: User,
    member: User,
    server: number,
    newRole: "OWNER" | "MODERATOR" | "MEMBER"
  ) {
    const result = await this.client
      .mutation(
        ChangeMemberRoleMutation,
        {
          serverId: server,
          userId: member.id,
          newRole,
        },
        {
          fetchOptions: { headers: { authorization: `Bearer ${owner.token}` } },
        }
      )
      .toPromise();

    if (result.data?.changeMemberRole.__typename !== "Member") {
      throw new Error(result.data?.changeMemberRole.message);
    }
  }
}

export function randomUser() {
  return {
    username: faker.helpers.unique(faker.internet.userName),
    password: "password",
    email: faker.helpers.unique(faker.internet.email),
  };
}

export async function createRandomServer(
  client: Client,
  owner: User,
  members: User[]
) {
  const server = await client.createServer(owner, faker.helpers.unique(faker.animal.snake));
  await Promise.all(
    members
      .filter((user) => user !== owner)
      .map((user) => client.addMember(owner, user, server))
  );
  const channels = await Promise.all(
    faker.helpers
      .uniqueArray(
        faker.animal.rodent,
        faker.datatype.number({ min: 5, max: 20 })
      )
      .map((name) =>
        client.createChannel(owner, server, name).catch(() => null!)
      )
      .filter((x) => x !== null)
  );
  const mods = faker.helpers.arrayElements(
    members.filter((user) => user !== owner),
    faker.datatype.number({ min: 1, max: 5 })
  );
  await Promise.all(
    mods.map((mod) => client.changeMemberRole(owner, mod, server, "MODERATOR"))
  );
  return { owner, server, members: [owner, ...members], channels };
}

export async function sendRandomMessage(
  client: Client,
  server: number,
  channels: number[],
  members: User[]
) {
  const user = faker.helpers.arrayElement(members);
  const channel = faker.helpers.arrayElement(channels);
  const message = faker.lorem.sentence();
  await client.sendMessage(user, server, channel, message);
}
