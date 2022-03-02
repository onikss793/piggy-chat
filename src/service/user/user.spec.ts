import { connectToMongoDB, mongoModels } from '../../database';
import { UserService } from './user.service';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('UserService', () => {
  const userService = new UserService();

  test('isUserNicknameUnique() should return true if it is unique', async () => {
    const nickname = 'IS_UNIQUE';
    const isUnique = await userService.isUserNicknameUnique(nickname);

    expect(isUnique).toEqual(true);
  });

  test('isUserNicknameUnique() should return true if it is  not unique', async () => {
    await setup('duplicated');

    const nickname = 'duplicated';
    const isUnique = await userService.isUserNicknameUnique(nickname);

    expect(isUnique).toEqual(false);
  });

  test('updateUserNickname() should update user\'s nickname', async () => {
    const user = await setup();

    const nickname = 'updated_nickname';
    const updatedUserDTO = await userService.updateUserNickname(user.id, nickname);

    expect(updatedUserDTO.nickname).toEqual(nickname);
  });

  test('joinGroupChannel() should update userGroupChannel', async () => {
    const user = await setup();

    const groupChannelUrl = 'GROUP_CHANNEL_URL';
    const userDTO = await userService.joinGroupChannel(user.id, groupChannelUrl);
    const updatedUser = await mongoModels.User.findById(user.id);

    expect(userDTO).toEqual(expect.objectContaining({ id: expect.any(String), nickname: 'nickname' }));
    expect(updatedUser).toEqual(expect.objectContaining({
      id: user.id,
      userGroupChannel: [expect.objectContaining({ channelUrl: groupChannelUrl })]
    }));
  });
});

async function setup(nickname = 'nickname') {
  await teardown();
  const user = await mongoModels.User.create({
    account: 'account',
    oauthKind: 'APPLE',
    nickname,
  });
  await user.save();
  return user;
}

async function teardown() {
  await mongoModels.User.deleteMany();
}
