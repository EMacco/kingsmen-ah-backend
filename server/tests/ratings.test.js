import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { generateToken, createTestUser } from './factory/user-factory';
import createTestArticle from './factory/article-factory';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let validArticleSlug;
const invalidArticleId = '00000000-0000-0000-0000-000000000000';

describe('TEST TO RATE AN ARTICLE', () => {
  before(async () => {
    // Create a user
    const { id } = await createTestUser({});
    userToken = `Bearer ${await generateToken({ id })}`;

    //  Create an article
    const newArticle = await createTestArticle(id, {});
    validArticleSlug = newArticle.slug;
  });

  it('should not rate article because rate is not provided in body', (done) => {
    try {
      chai
        .request(app)
        .post(`/api/v1/articles/${invalidArticleId}/rate`)
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal('rate is required');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because rate is not a number', (done) => {
    try {
      chai
        .request(app)
        .post(`/api/v1/articles/${invalidArticleId}/rate`)
        .set('Authorization', userToken)
        .send({ rate: '4s' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal('rate must be a number');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because rate is not (1, 2, 3, 4, or 5)', (done) => {
    try {
      chai
        .request(app)
        .post(`/api/v1/articles/${invalidArticleId}/rate`)
        .set('Authorization', userToken)
        .send({ rate: 4.5 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.rate).to.equal('rate must be one of [1, 2, 3, 4, 5]');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because user token is not provided', (done) => {
    try {
      chai
        .request(app)
        .post(`/api/v1/articles/${invalidArticleId}/rate`)
        .send({ articleId: '26797322-78a7-4651-8a67-998315381b22', rate: 4.5 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('Invalid token supplied: format Bearer <token>');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 400);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should not rate article because article does not exist', (done) => {
    try {
      chai
        .request(app)
        .post(`/api/v1/articles/${invalidArticleId}/rate`)
        .set('Authorization', userToken)
        .send({ rate: 4 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.equal('Article does not exist');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 404);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should create a new rating', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${validArticleSlug}/rate`)
        .set('Authorization', userToken)
        .send({ rate: 4 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.article.author).to.be.an('object');
          expect(res.body.payload.article).to.be.an('object');
          expect(res.body.message).to.equal('Article has been rated');
          expect(res.body.payload.rate).to.equal(4);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 201);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should update existing rating', (done) => {
    try {
      chai.request(app)
        .post(`/api/v1/articles/${validArticleSlug}/rate`)
        .set('Authorization', userToken)
        .send({ rate: 3 })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.article.author).to.be.an('object');
          expect(res.body.payload.article).to.be.an('object');
          expect(res.body.message).to.equal('Article has been rated');
          expect(res.body.payload.rate).to.equal(3);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('status', 200);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
