import { Request } from 'express';
import * as Mongoose from 'mongoose';
import { sessionTeardown, userSetup } from '../../../test-utils';
import { IAppleHandler, IKakaoHandler, MockAppleHandler, MockKakaoHandler } from '../../external';
import { IJWTHandler, JWTHandler } from '../../external/jsonwebtoken';
import { connectToMongoDB } from '../../mongo';
import { AuthService, ILoginDTO } from '../../service';
import { log } from '../../util';
import { AuthController } from './auth.controller';

let mongoose: typeof Mongoose;

beforeAll(async () => {
  mongoose = await connectToMongoDB();
});
afterAll(async () => {
  await mongoose?.connection.close();
});

describe('Auth Controller Test', () => {
  let appleHandler: IAppleHandler;
  let kakaoHandler: IKakaoHandler;
  let jwtHandler: IJWTHandler;
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    appleHandler = new MockAppleHandler();
    kakaoHandler = new MockKakaoHandler();
    jwtHandler = new JWTHandler();
    authService = new AuthService(appleHandler, kakaoHandler, jwtHandler);
    authController = new AuthController(authService);

    await userSetup();
    await sessionTeardown();
  });

  test('login() should return login Data', async () => {
    const user = await userSetup();

    jest.spyOn(jwtHandler, 'verifyAccessToken').mockImplementation(() => ({ userId: String(user.id) }));

    const req = {
      headers: { authorization: 'access_token', 'refresh-token': 'refresh-token' }
    } as unknown as Request;
    const loginDTO = await authController.login(req);
    log(loginDTO);
    expect(loginDTO).toEqual<ILoginDTO>({
      id: expect.any(String),
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      isSignedUpUser: expect.any(Boolean),
    });
  });
});
