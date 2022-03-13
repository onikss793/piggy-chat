import { userTeardown } from '../../../test-utils';
import { MockAppleHandler, MockKakaoHandler } from '../../external';
import { connectToMongoDB, models } from '../../mongo';
import { AuthService } from './auth.service';
import { IAppleLoginDTO, IKakaoLoginDTO } from './interface';

let mongoose: typeof import('mongoose');

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});

afterAll(async () => {
  await mongoose?.connection.close();
});

describe('AuthService', () => {
  const authService = new AuthService(
    new MockAppleHandler(),
    new MockKakaoHandler()
  );

  test('kakaoLogin() should return loginDTO and create new User', async () => {
    await userTeardown();

    const kakaoLoginDTO: IKakaoLoginDTO = { access_token: 'random_string' };
    const loginDTO = await authService.kakaoLogin(kakaoLoginDTO);
    const users = await models.User.find();

    await userTeardown();

    expect(loginDTO).toEqual({
      id: expect.any(String),
      jwt: expect.any(String),
    });
    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(expect.objectContaining({
      account: 'test@kakao.com',
      oauthKind: 'KAKAO',
      nickname: 'testing_nickname',
      phoneNumber: null,
      verified: false,
    }));
  });

  test('appleLogin() should return loginDTO and create nwe User', async () => {
    await userTeardown();

    const appleLoginDTO: IAppleLoginDTO = { identity_token: 'random_string' };
    const loginDTO = await authService.appleLogin(appleLoginDTO);
    const users = await models.User.find();

    await userTeardown();

    expect(loginDTO).toEqual({
      id: expect.any(String),
      jwt: expect.any(String),
    });
    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(expect.objectContaining({
      account: 'test_sub@apple.com',
      oauthKind: 'APPLE',
      nickname: 'test_sub@apple.com',
      phoneNumber: null,
      verified: false,
    }));
  });
});
