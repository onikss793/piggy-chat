import { mongoModels } from '../mongo';

export async function userSetup(nickname = 'nickname') {
  await userTeardown();
  const user = await mongoModels.User.create({
    account: 'account',
    oauthKind: 'APPLE',
    nickname,
  });
  await user.save();
  return user;
}

export async function userTeardown() {
  await mongoModels.User.deleteMany();
}

export async function scrapTeardown() {
  await mongoModels.Scrap.deleteMany();
}
