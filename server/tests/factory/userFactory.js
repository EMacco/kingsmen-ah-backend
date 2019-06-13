import faker from 'faker';
import models from '@models';
import Token from '@helpers/Token';

const { User } = models;

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

const createTestUser = async ({ username, email }) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.internet.userName(),
    email: email || faker.internet.email(),
    password: faker.internet.password()
  });

  return newUser;
};


export { generateToken, createTestUser };
