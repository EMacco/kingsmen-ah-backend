import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import CommentController from '../controllers/comment';
import validateComment from '../validations/comment';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('TEST TO CHECK ROUTE ', () => {
  it('should return error 404 if not found', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/people')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Not Found');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
  it('should return success on hitting base route', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.eql('Welcome to the Authors Haven API');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('CommentController', () => {
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('should handle error on creation of a new comment', async () => {
    const stubFunc = { validateComment };

    sandbox.stub(stubFunc, 'validateComment').rejects('aPi');
    const next = sinon.spy();

    await CommentController.create({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle error on getting comments', async () => {
    const next = sinon.spy();

    await CommentController.getComments({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle error on updating a comment', async () => {
    const stubFunc = { validateComment };

    sandbox.stub(stubFunc, 'validateComment').rejects('aPi');
    const next = sinon.spy();

    await CommentController.updateComment({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle error on `failed` delete of a comment', async () => {
    const next = sinon.spy();

    await CommentController.deleteComment({}, {}, next);
    sinon.assert.calledOnce(next);
  });
});
