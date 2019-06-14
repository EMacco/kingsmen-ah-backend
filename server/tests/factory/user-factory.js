import models from '@models';
import faker from 'faker';
import Token from '@helpers/Token';

const { User } = models;

const generateToken = async (userDetails) => {
  const token = await Token.create(userDetails);
  return token;
};

const createTestUser = async ({ username, email }) => {
  const newUser = await User.create({
    id: faker.random.uuid(),
    username: username || faker.random.alphaNumeric(6),
    email: email || faker.internet.email(),
    password: faker.internet.password(),
    active: true
  });
  return newUser;
};

export { createTestUser, generateToken };
