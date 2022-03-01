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
    await setup();

    const nickname = 'duplicated';
    const isUnique = await userService.isUserNicknameUnique(nickname);

    await teardown();

    expect(isUnique).toEqual(false);
  });

  test('updateUserNickname() should update user\'s nickname', async () => {
    const user = await setup();

    const nickname = 'updated_nickname';
    const updatedUserDTO = await userService.updateUserNickname(user.id, nickname);
    await teardown();

    expect(updatedUserDTO.nickname).toEqual(nickname);
  });
});

async function setup() {
  const user = await mongoModels.User.create({
    account: 'account',
    oauthKind: 'APPLE',
    nickname: 'duplicated',
  });
  await user.save();
  return user;
}

async function teardown() {
  await mongoModels.User.deleteMany();
}
