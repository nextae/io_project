import pytest

from app import schema
from schema.types import Role


class Tests:
    tokens: dict[str, str] = {}

    async def register_or_login(
            self,
            username: str = 'testuser',
            password: str = 'testuser',
            email: str = 'testuser@test.com'
    ):
        """Registers or logs in the user to obtain the token."""

        if username in self.tokens:
            return self.tokens[username]

        print('Registering...')

        register_mutation = """
            mutation Register($username: String!, $password: String!, $email: String!) {
                register(username: $username, password: $password, email: $email) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on AuthPayload {
                        token
                    }
                }
            }
        """

        login_mutation = """
            mutation Login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on AuthPayload {
                        token
                    }
                }
            }
        """
        
        register_data = await schema.execute(
            register_mutation,
            variable_values={
                'username': username,
                'password': password,
                'email': email
            }
        )

        data = register_data.data['register']

        if data['__typename'] == 'AuthPayload':
            self.tokens[username] = data['token']
            return

        login_data = await schema.execute(
            login_mutation,
            variable_values={
                'username': username,
                'password': password
            }
        )

        data = login_data.data['login']

        if data['__typename'] != 'AuthPayload':
            return

        self.tokens[username] = data['token']

    @pytest.mark.asyncio
    async def test_user(self):
        """
        Tests the following scenario:

        - Attempt to register with too short password
        - Register
        - Attempt to register with the same username again
        - Attempt to register with the same email again
        - Attempt to log in with incorrect password
        - Log in
        - Attempt to change password with incorrect oldPassword
        - Change Password
        - Log in
        - Attempt to delete the user without authentication
        - Delete the user
        """

        register_mutation = """
            mutation Register($username: String!, $password: String!, $email: String!) {
                register(username: $username, password: $password, email: $email) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on AuthPayload {
                        user {
                            name
                            email
                        }
                        token
                    }
                }
            }
        """

        login_mutation = """
            mutation Login($username: String!, $password: String!) {
                login(username: $username, password: $password) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on AuthPayload {
                        token
                    }
                }
            }
        """

        change_password_mutation = """
            mutation ChangePassword($old_password: String!, $new_password: String!) {
                changePassword(oldPassword: $old_password, newPassword: $new_password) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on User {
                        id
                        name
                    }
                }
            }
        """

        delete_mutation = """
            mutation DeleteUser {
                deleteUser {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on User {
                        id
                        name
                    }
                }
            }
        """

        # Test PasswordTooShort
        resp = await schema.execute(
            register_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'test',
                'email': 'testuser123@test.com'
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['register']
        assert data['__typename'] == 'PasswordTooShort'

        # Test successfully registering
        resp = await schema.execute(
            register_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'testuser123',
                'email': 'testuser123@test.com'
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['register']
        assert data['__typename'] == 'AuthPayload'

        assert data['user']['name'] == 'testuser123'
        assert data['user']['email'] == 'testuser123@test.com'

        token = data['token']

        # Test UserNameExists
        resp = await schema.execute(
            register_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'testuser123',
                'email': 'testuser1234@test.com'
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['register']
        assert data['__typename'] == 'UserNameExists'

        # Test EmailExists
        resp = await schema.execute(
            register_mutation,
            variable_values={
                'username': 'testuser1234',
                'password': 'testuser123',
                'email': 'testuser123@test.com'
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['register']
        assert data['__typename'] == 'EmailExists'

        # Test InvalidLoginData
        resp = await schema.execute(
            login_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'test',
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['login']
        assert data['__typename'] == 'InvalidLoginData'

        # Test successfully logging in
        resp = await schema.execute(
            login_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'testuser123',
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['login']
        assert data['__typename'] == 'AuthPayload'

        # Test changing password with incorrect old_password
        resp = await schema.execute(
            change_password_mutation,
            variable_values={
                'old_password': 'testuser12',
                'new_password': 'testuser1234',
            },
            context_value={'token': token}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['changePassword']
        assert data['__typename'] == 'InvalidPassword'

        # Test changing password
        resp = await schema.execute(
            change_password_mutation,
            variable_values={
                'old_password': 'testuser123',
                'new_password': 'testuser1234',
            },
            context_value={'token': token}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['changePassword']
        assert data['__typename'] == 'User'

        # Test successfully logging in after changing the password
        resp = await schema.execute(
            login_mutation,
            variable_values={
                'username': 'testuser123',
                'password': 'testuser1234',
            }
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['login']
        assert data['__typename'] == 'AuthPayload'

        # Test deleting the user without authentication
        resp = await schema.execute(
            delete_mutation
        )

        assert resp.errors is not None
        assert resp.errors[0].message == 'User is not authenticated'

        # Test successfully deleting the user
        resp = await schema.execute(
            delete_mutation,
            context_value={'token': token}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['deleteUser']
        assert data['__typename'] == 'User'
        assert data['name'] == 'testuser123'

    @pytest.mark.asyncio
    async def test_server(self):
        """
        Tests the following scenario:

        - Attempt to create a Server with too short name
        - Attempt to create a Server with too long name
        - Create a Server
        - Attempt to get a non-existing Server
        - Get the created Server
        - Check if the user has the OWNER role
        - Change the Server name
        - Delete the Server
        """
        create_mutation = """
            mutation AddServer($name: String!) {
                addServer(name: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        get_query = """
            query GetServer($server_id: Int!) {
                server(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                        members {
                            id
                            role
                        }
                    }
                }
            }
        """

        change_name_mutation = """
            mutation ChangeServerName($server_id: Int!, $name: String!) {
                changeServerName(serverId: $server_id, newName: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        delete_mutation = """
            mutation DeleteServer($server_id: Int!) {
                deleteServer(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """
        
        username = 'testuser'

        await self.register_or_login()
        if username not in self.tokens:
            pytest.fail('Token not found!')

        # Test ServerNameTooShort
        resp = await schema.execute(
            create_mutation,
            variable_values={
                'name': 'abc'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None
        assert resp.data['addServer']['__typename'] == 'ServerNameTooShort'

        # Test ServerNameTooLong
        resp = await schema.execute(
            create_mutation,
            variable_values={
                'name': 'a' * 33
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None
        assert resp.data['addServer']['__typename'] == 'ServerNameTooLong'

        # Test successfully creating a server
        resp = await schema.execute(
            create_mutation,
            variable_values={
                'name': 'Test Server'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addServer']
        assert data['__typename'] == 'Server'
        assert data['name'] == 'Test Server'

        server_id = data['id']

        # Test getting a non-existing server
        resp = await schema.execute(
            get_query,
            variable_values={
                'server_id': -1
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['server']
        assert data['__typename'] == 'NoPermissions'

        # Test getting the server
        resp = await schema.execute(
            get_query,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['server']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server'

        # Test if the member has the OWNER role
        members = data['members']
        assert members[0]['role'] == 'OWNER'

        # Test changing the server name
        resp = await schema.execute(
            change_name_mutation,
            variable_values={
                'server_id': int(server_id),
                'name': 'Test Server 2'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['changeServerName']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server 2'

        # Test deleting the server
        resp = await schema.execute(
            delete_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['deleteServer']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server 2'

    @pytest.mark.asyncio
    async def test_channel(self):
        """
        Tests the following scenario:

        - Create a Server
        - Attempt to create a Channel with too short name
        - Attempt to create a Channel with too long name
        - Create a Channel
        - Attempt to get a non-existing Channel
        - Get the created Channel
        - Change the Channel name
        - Attempt to send a Message with too long content
        - Send a Message
        - Get the Message
        - Delete the Channel
        - Delete the Server
        """

        create_server_mutation = """
            mutation AddServer($name: String!) {
                addServer(name: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        create_channel_mutation = """
            mutation AddChannel($server_id: Int!, $name: String!) {
                addChannel(serverId: $server_id, name: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Channel {
                        id
                        serverId
                        name
                    }
                }
            }
        """

        get_channel_query = """
            query GetChannel($server_id: Int!, $channel_id: Int!) {
                channel(serverId: $server_id, channelId: $channel_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Channel {
                        id
                        serverId
                        name
                    }
                }
            }
        """

        change_channel_name_mutation = """
            mutation ChangeChannelName($server_id: Int!, $channel_id: Int!, $name: String!) {
                changeChannelName(serverId: $server_id, channelId: $channel_id, newName: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Channel {
                        id
                        name
                    }
                }
            }
        """

        send_message_mutation = """
            mutation AddMessage($server_id: Int!, $channel_id: Int!, $content: String!) {
                addMessage(serverId: $server_id, channelId: $channel_id, content: $content) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Message {
                        id
                        content
                    }
                }
            }
        """

        get_messages_query = """
            query GetMessages($server_id: Int!, $channel_id: Int!) {
                messages(serverId: $server_id, channelId: $channel_id) {
                    __typename
                    id
                    content
                }
            }
        """

        delete_channel_mutation = """
            mutation DeleteChannel($server_id: Int!, $channel_id: Int!) {
                deleteChannel(serverId: $server_id, channelId: $channel_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Channel {
                        id
                        name
                    }
                }
            }
        """

        delete_server_mutation = """
            mutation DeleteServer($server_id: Int!) {
                deleteServer(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        username = 'testuser'

        await self.register_or_login()
        if username not in self.tokens:
            pytest.fail('Token not found!')

        resp = await schema.execute(
            create_server_mutation,
            variable_values={
                'name': 'Test Server'
            },
            context_value={'token': self.tokens[username]}
        )

        server_id = resp.data['addServer']['id']

        # Test ChannelNameTooShort
        resp = await schema.execute(
            create_channel_mutation,
            variable_values={
                'server_id': int(server_id),
                'name': 'abc'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addChannel']
        assert data['__typename'] == 'ChannelNameTooShort'

        # Test ChannelNameTooLong
        resp = await schema.execute(
            create_channel_mutation,
            variable_values={
                'server_id': int(server_id),
                'name': 'a' * 33
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addChannel']
        assert data['__typename'] == 'ChannelNameTooLong'

        # Test successfully creating a channel
        resp = await schema.execute(
            create_channel_mutation,
            variable_values={
                'server_id': int(server_id),
                'name': 'Test Channel'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addChannel']
        assert data['__typename'] == 'Channel'
        assert data['serverId'] == int(server_id)
        assert data['name'] == 'Test Channel'

        channel_id = data['id']

        # Test getting a non-existing channel
        resp = await schema.execute(
            get_channel_query,
            variable_values={
                'server_id': int(server_id),
                'channel_id': -1
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['channel']
        assert data['__typename'] == 'ChannelNotFound'

        # Test getting the channel
        resp = await schema.execute(
            get_channel_query,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['channel']
        assert data['__typename'] == 'Channel'
        assert data['id'] == channel_id
        assert data['serverId'] == int(server_id)
        assert data['name'] == 'Test Channel'

        # Test changing the channel name
        resp = await schema.execute(
            change_channel_name_mutation,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id),
                'name': 'Test Channel 2'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['changeChannelName']
        assert data['__typename'] == 'Channel'
        assert data['id'] == channel_id
        assert data['name'] == 'Test Channel 2'

        # Test sending a message that's too long
        resp = await schema.execute(
            send_message_mutation,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id),
                'content': 'a' * 513
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addMessage']
        assert data['__typename'] == 'MessageTooLong'

        # Test sending a message
        resp = await schema.execute(
            send_message_mutation,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id),
                'content': 'hello'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['addMessage']
        assert data['__typename'] == 'Message'
        assert data['content'] == 'hello'

        # Test getting the message
        resp = await schema.execute(
            get_messages_query,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['messages']
        assert data[0]['__typename'] == 'Message'
        assert data[0]['content'] == 'hello'

        # Test deleting the channel
        resp = await schema.execute(
            delete_channel_mutation,
            variable_values={
                'server_id': int(server_id),
                'channel_id': int(channel_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['deleteChannel']
        assert data['__typename'] == 'Channel'
        assert data['id'] == channel_id
        assert data['name'] == 'Test Channel 2'

        # Test deleting the server
        resp = await schema.execute(
            delete_server_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['deleteServer']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server'

    @pytest.mark.asyncio
    async def test_member(self):
        """
        Tests the following scenario:

        - Create a Server
        - Find a User by username
        - Invite the User to the Server
        - Attempt to invite the User again
        - Get the Invitation
        - Decline the Invitation as the second User
        - Attempt to get the Invitation as the second User after it has been declined
        - Invite the User again
        - Attempt to get the Server as the second User before accepting the Invitation
        - Accept the Invitation as the second User
        - Get the Server as the second User
        - Attempt to invite the User again
        - Leave the Server as the second User
        - Invite the User again
        - Accept the Invitation as the second User
        - Get the new Member
        - Change new Member's Role
        - Kick the new Member
        - Attempt to get the Member after kicking
        - Delete the Server
        """

        create_server_mutation = """
            mutation AddServer($name: String!) {
                addServer(name: $name) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        get_user_query = """
            query GetUser($username: String!) {
                user(username: $username) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on User {
                        id
                        name
                    }
                }
            }
        """

        invite_user_mutation = """
            mutation InviteUser($server_id: Int!, $user_id: Int!, $content: String!) {
                inviteUser(serverId: $server_id, userId: $user_id, content: $content) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Invitation {
                        userId
                        serverId
                        content
                    }
                }
            }
        """

        get_invitations_query = """
            query GetInvitations {
                invitations {
                    __typename
                    userId
                    serverId
                    content
                }
            }
        """

        decline_invitation_mutation = """
            mutation DeclineInvitation($server_id: Int!) {
                declineInvitation(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Invitation {
                        userId
                        serverId
                        content
                    }
                }
            }
        """

        accept_invitation_mutation = """
            mutation AcceptInvitation($server_id: Int!) {
                acceptInvitation(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Invitation {
                        userId
                        serverId
                        content
                    }
                }
            }
        """

        get_server_query = """
            query GetServer($server_id: Int!) {
                server(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        get_member_query = """
            query GetMember($server_id: Int!, $user_id: Int!) {
                member(serverId: $server_id, userId: $user_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Member {
                        id
                        name
                        role
                    }
                }
            }
        """

        change_member_role_mutation = """
            mutation ChangeMemberRole($server_id: Int!, $user_id: Int!, $new_role: Role!) {
                changeMemberRole(serverId: $server_id, userId: $user_id, newRole: $new_role) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Member {
                        id
                        name
                        role
                    }
                }
            }
        """

        leave_server_mutation = """
            mutation LeaveServer($server_id: Int!) {
                leaveServer(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Member {
                        id
                        name
                        role
                    }
                }
            }
        """

        kick_member_mutation = """
            mutation KickMember($server_id: Int!, $user_id: Int!) {
                kickMember(serverId: $server_id, userId: $user_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Member {
                        id
                        name
                        role
                    }
                }
            }
        """

        delete_server_mutation = """
            mutation DeleteServer($server_id: Int!) {
                deleteServer(serverId: $server_id) {
                    __typename
                    ... on Error {
                        message
                    }
                    ... on Server {
                        id
                        name
                    }
                }
            }
        """

        username = 'testuser'
        username2 = 'testuser2'

        await self.register_or_login()
        if username not in self.tokens:
            pytest.fail('Token not found!')

        await self.register_or_login(username2, username2, 'testuser2@test.com')
        if username2 not in self.tokens:
            pytest.fail(f'{username2} unauthorized!')

        resp = await schema.execute(
            create_server_mutation,
            variable_values={
                'name': 'Test Server'
            },
            context_value={'token': self.tokens[username]}
        )

        server_id = resp.data['addServer']['id']

        # Test getting the user by username
        resp = await schema.execute(
            get_user_query,
            variable_values={
                'username': 'testuser2'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['user']
        assert data['__typename'] == 'User'
        assert data['name'] == 'testuser2'

        user_id = data['id']

        # Test inviting the User
        resp = await schema.execute(
            invite_user_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'content': 'Join my server please ^_^'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['inviteUser']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server please ^_^'

        # Test InvitationExists
        resp = await schema.execute(
            invite_user_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'content': 'Join my server please ^_^'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['inviteUser']
        assert data['__typename'] == 'InvitationExists'

        # Test getting the Invitation as the other user
        resp = await schema.execute(
            get_invitations_query,
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['invitations']
        assert data[0]['__typename'] == 'Invitation'
        assert data[0]['serverId'] == int(server_id)
        assert data[0]['userId'] == int(user_id)
        assert data[0]['content'] == 'Join my server please ^_^'

        # Test declining the Invitation
        resp = await schema.execute(
            decline_invitation_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['declineInvitation']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server please ^_^'

        # Test getting the Invitation after declining
        resp = await schema.execute(
            get_invitations_query,
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['invitations']
        assert len(data) == 0

        # Test inviting the User again
        resp = await schema.execute(
            invite_user_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'content': 'Join my server!'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['inviteUser']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server!'

        # Test getting the Server as the second user before accepting the Invitation
        resp = await schema.execute(
            get_server_query,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['server']
        assert data['__typename'] == 'NoPermissions'

        # Test accepting the Invitation
        resp = await schema.execute(
            accept_invitation_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['acceptInvitation']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server!'

        # Test getting the Server as the second user
        resp = await schema.execute(
            get_server_query,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['server']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server'

        # Test inviting the User when the User is already a Member
        resp = await schema.execute(
            invite_user_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'content': 'Join my server!'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['inviteUser']
        assert data['__typename'] == 'MemberExists'

        # Test leaving the Server as the second User
        resp = await schema.execute(
            leave_server_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['leaveServer']
        assert data['__typename'] == 'Member'

        # Test inviting the User again after leaving
        resp = await schema.execute(
            invite_user_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'content': 'Join my server!'
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['inviteUser']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server!'

        # Test accepting the Invitation
        resp = await schema.execute(
            accept_invitation_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username2]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['acceptInvitation']
        assert data['__typename'] == 'Invitation'
        assert data['serverId'] == int(server_id)
        assert data['userId'] == int(user_id)
        assert data['content'] == 'Join my server!'

        # Test getting the new Member
        resp = await schema.execute(
            get_member_query,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['member']
        assert data['__typename'] == 'Member'
        assert data['id'] == user_id
        assert data['name'] == 'testuser2'
        assert data['role'] == Role.MEMBER.name

        # Test changing the Member's role
        resp = await schema.execute(
            change_member_role_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id),
                'new_role': Role.MODERATOR.name
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['changeMemberRole']
        assert data['__typename'] == 'Member'
        assert data['id'] == user_id
        assert data['name'] == 'testuser2'
        assert data['role'] == Role.MODERATOR.name

        # Test kicking the Member
        resp = await schema.execute(
            kick_member_mutation,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['kickMember']
        assert data['__typename'] == 'Member'
        assert data['id'] == user_id
        assert data['name'] == 'testuser2'
        assert data['role'] == Role.MODERATOR.name

        # Test getting the Member after kicking
        resp = await schema.execute(
            get_member_query,
            variable_values={
                'server_id': int(server_id),
                'user_id': int(user_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['member']
        assert data['__typename'] == 'MemberNotFound'

        # Test deleting the server
        resp = await schema.execute(
            delete_server_mutation,
            variable_values={
                'server_id': int(server_id)
            },
            context_value={'token': self.tokens[username]}
        )

        assert resp.errors is None
        assert resp.data is not None

        data = resp.data['deleteServer']
        assert data['__typename'] == 'Server'
        assert data['id'] == server_id
        assert data['name'] == 'Test Server'
