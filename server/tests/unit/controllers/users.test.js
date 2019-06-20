import sinon from 'sinon';
import { validateSignup, validateLogin } from '@validations/auth';
import UsersController from '@controllers/users';
import Token from '@helpers/Token';


describe('UsersController', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle update of creation of users', async () => {
    const stubFunc = { validateSignup };
    sandbox.stub(stubFunc, 'validateSignup').rejects('Oops');

    const next = sinon.spy();
    await UsersController.create({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle user login', async () => {
    const stubFunc = { validateLogin };
    sandbox.stub(stubFunc, 'validateLogin').rejects('Oops');

    const next = sinon.spy();
    await UsersController.login({}, {}, next);
    sinon.assert.calledOnce(next);
  });


  it('should handle get users', async () => {
    const next = sinon.spy();
    await UsersController.getUsers({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should log users out', async () => {
    const jsonFunc = sinon.spy();
    const res = {
      status: () => ({
        json: jsonFunc
      })
    };
    await UsersController.logout({}, res);
    sinon.assert.calledOnce(jsonFunc);
  });
});


describe('Test Token authorize', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should test user token', async () => {
    const next = sinon.spy();
    await Token.authorize({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should test mail sent function', async () => {
    const next = sinon.spy();
    await UsersController.sendMailToVerifyAccount({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should test verifyAccount function', async () => {
    const next = sinon.spy();
    await UsersController.verifyAccount({}, {}, next);
    sinon.assert.calledOnce(next);
  });
});
