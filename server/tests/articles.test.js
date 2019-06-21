import chai from 'chai';
import chaiHttp from 'chai-http';
import { generateToken, createNonActiveUser } from './factory/user-factory';
import createArticles from './factory/article-factory';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let wrongToken;


describe('TESTS TO CREATE AN ARTICLE', () => {
  let newArticle, userToken;
  before(async () => {
    const { id, email } = await createNonActiveUser({ });
    const payload = {
      id,
      email
    };
    userToken = await generateToken(payload);
    newArticle = await createArticles(id, {});
    wrongToken = userToken;
  });

  it('should create an article successfully', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: newArticle.title,
          body: newArticle.body
        })
        .end((err, res) => {
          const returnStatus = 'success';
          expect(res.status).to.equal(201);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.title).to.be.a('string');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.eql(returnStatus);
          expect(res.body).to.have.property('status', returnStatus);
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return body is not allowed to be empty ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: newArticle.title,
          body: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.body).to.eql('body is not allowed to be empty');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return title is not allowed to be empty ', (done) => {
    try {
      chai.request(app)
        .post('/api/v1/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: '',
          body: newArticle.body
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.title).to.eql('title is not allowed to be empty');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO UPDATE AN ARTICLE', () => {
  let newArticle, userToken;
  before(async () => {
    const { id, email } = await createNonActiveUser({ });
    const payload = {
      id,
      email
    };
    userToken = await generateToken(payload);
    newArticle = await createArticles(id, {});
  });

  it('should update an article successfully', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: newArticle.title,
          body: newArticle.body,
        })
        .end((err, res) => {
          const returnStatus = 'success';
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('object');
          expect(res.body.payload.title).to.be.a('string');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.eql(returnStatus);
          expect(res.body).to.have.property('status', returnStatus);
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return slug not found', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: newArticle.title,
          body: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.body).to.eql('body is not allowed to be empty');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return you do not have permission to modify article', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${wrongToken}`)
        .send({
          title: newArticle.title,
          body: newArticle.body,
          image: newArticle.image
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('You do not have permission to update this article!');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return article does not exist', (done) => {
    try {
      chai.request(app)
        .put(`/api/v1/articles/${newArticle.title}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: newArticle.title,
          body: newArticle.body,
          image: newArticle.image
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Article does not exist');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO GET ARTICLES', () => {
  let newArticle;
  before(async () => {
    const { id } = await createNonActiveUser({ });

    newArticle = await createArticles(id, {});
  });
  it('should get an article successfully', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/articles/${newArticle.slug}`)
        .end((err, res) => {
          const returnStatus = 'success';
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.eql(returnStatus);
          expect(res.body).to.have.property('status', returnStatus);
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should get all article successfully', (done) => {
    try {
      chai.request(app)
        .get('/api/v1/articles')
        .end((err, res) => {
          const returnStatus = 'success';
          expect(res.status).to.equal(200);
          expect(res.body.payload).to.be.an('array');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.eql(returnStatus);
          expect(res.body).to.have.property('status', returnStatus);
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return an artcle does not exist', (done) => {
    try {
      chai.request(app)
        .get(`/api/v1/articles/${newArticle.title}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Article does not exist');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});

describe('TESTS TO DELETE AN ARTICLE', () => {
  let newArticle, userToken, useNotPermittedToDelete;
  before(async () => {
    const { id, email } = await createNonActiveUser({ });
    const payload = {
      id,
      email
    };
    userToken = await generateToken(payload);
    newArticle = await createArticles(id, {});
    const { id: user, email: mail } = await createNonActiveUser({ });
    payload.id = user;
    payload.email = mail;
    useNotPermittedToDelete = await generateToken(payload);
  });

  it('should return no permission to delete article', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${useNotPermittedToDelete}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('You do not have permission to delete this article!');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should update an article successfully', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${newArticle.slug}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });

  it('should return article does not exist', (done) => {
    try {
      chai.request(app)
        .delete(`/api/v1/articles/${newArticle.title}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.global).to.eql('Article does not exist');
          expect(res.body).to.have.property('status');
          done();
        });
    } catch (err) {
      throw err.message;
    }
  });
});
