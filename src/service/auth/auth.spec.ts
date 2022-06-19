import { TokenExpiredError } from 'jsonwebtoken';
import { mongo } from 'mongoose';
import { sessionTeardown, userSetup, userTeardown } from '../../../test-utils';
import { IAppleHandler, IKakaoHandler, MockAppleHandler, MockKakaoHandler } from '../../external';
import { IJWTHandler, JWTHandler } from '../../external/jsonwebtoken';
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
  let appleHandler: IAppleHandler;
  let kakaoHandler: IKakaoHandler;
  let jwtHandler: IJWTHandler;
  let authService: AuthService;

  beforeEach(async () => {
    appleHandler = new MockAppleHandler();
    kakaoHandler = new MockKakaoHandler();
    jwtHandler = new JWTHandler();
    authService = new AuthService(appleHandler, kakaoHandler, jwtHandler);

    await userTeardown();
    await sessionTeardown();
  });

  test('kakaoLogin() should return loginDTO and create new User', async () => {
    const kakaoLoginDTO: IKakaoLoginDTO = { accessToken: 'random_string' };
    const loginDTO = await authService.kakaoLogin(kakaoLoginDTO);
    const users = await models.User.find();
    const sessions = await models.Session.find();
    const session = sessions[0];

    expect(sessions.length).toBe(1);
    expect(session).toEqual(expect.objectContaining({
      userId: expect.any(mongo.ObjectId),
      sessionId: expect.any(String),
    }));
    expect(loginDTO).toEqual({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isSignedUpUser: false,
    });
    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(expect.objectContaining({
      account: 'test@kakao.com',
      oauthKind: 'KAKAO',
      phoneNumber: null,
      verified: false,
    }));
  });

  test('appleLogin() should return loginDTO and create nwe User', async () => {
    const appleLoginDTO: IAppleLoginDTO = { identityToken: 'random_string' };
    const loginDTO = await authService.appleLogin(appleLoginDTO);
    const users = await models.User.find();
    const sessions = await models.Session.find();
    const session = sessions[0];

    expect(sessions.length).toBe(1);
    expect(session).toEqual(expect.objectContaining({
      userId: expect.any(mongo.ObjectId),
      sessionId: expect.any(String),
    }));
    expect(loginDTO).toEqual({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isSignedUpUser: false,
    });
    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(expect.objectContaining({
      account: 'test_sub@apple.com',
      oauthKind: 'APPLE',
      phoneNumber: null,
      verified: false,
    }));
  });

  test('login() should return loginDTO', async () => {
    const kakaoLoginDTO: IKakaoLoginDTO = { accessToken: 'random_string' };
    const { accessToken, refreshToken } = await authService.kakaoLogin(kakaoLoginDTO);

    const loginDTO = await authService.login(accessToken, refreshToken);
    expect(loginDTO).toEqual({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isSignedUpUser: true,
    });
  });

  test('login() should return loginDTO when access_token is expired', async () => {
    const kakaoLoginDTO: IKakaoLoginDTO = { accessToken: 'random_string' };
    const { accessToken, refreshToken } = await authService.kakaoLogin(kakaoLoginDTO);

    jest.spyOn(jwtHandler, 'verifyAccessToken').mockImplementation(() => {
      throw new TokenExpiredError('expired', new Date());
    });
    const verifyRefreshToken = jest.spyOn(jwtHandler, 'verifyRefreshToken');
    const decodeToken = jest.spyOn(jwtHandler, 'decodeToken');

    const loginDTO = await authService.login(accessToken, refreshToken);
    expect(loginDTO).toEqual({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isSignedUpUser: true,
    });
    expect(verifyRefreshToken).toBeCalledTimes(1);
    expect(decodeToken).toBeCalledTimes(1);
  });

  test('login() should throw UnauthorizedException when refresh_token is expired', async () => {
    expect.assertions(3);

    const kakaoLoginDTO: IKakaoLoginDTO = { accessToken: 'random_string' };
    const { accessToken, refreshToken } = await authService.kakaoLogin(kakaoLoginDTO);

    jest.spyOn(jwtHandler, 'verifyAccessToken').mockImplementation(() => {
      throw new TokenExpiredError('expired', new Date());
    });
    const verifyRefreshToken = jest.spyOn(jwtHandler, 'verifyRefreshToken');
    verifyRefreshToken.mockImplementation(() => {
      throw new TokenExpiredError('expired', new Date());
    });
    const decodeToken = jest.spyOn(jwtHandler, 'decodeToken');

    await authService.login(accessToken, refreshToken).catch(e => {
      expect(e.status).toEqual(401);
    });
    expect(decodeToken).toBeCalledTimes(0);
    expect(verifyRefreshToken).toBeCalledTimes(1);
  });

  test('isNickNameUnique() should return whether nickname is unique', async () => {
    const user = await userSetup();
    const result = await authService.isNicknameUnique(user.nickname);

    expect(result).toBeFalsy();
  });
});
