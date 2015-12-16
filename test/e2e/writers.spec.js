import supertest from 'supertest';

import { apiUrl, inviteSharedKey } from 'c0nfig';
import { createTestEmail, getTestUser, generateArticles } from '../testUtils';

let request = supertest(`${apiUrl}/writers`);
let writerData = {
    email: createTestEmail(),
    password: 'qwerty',
    name: 'John Doe'
};

let inviteHeaders = {'x-invite-code': inviteSharedKey};
let invalidInviteHeaders = {'x-invite-code': '122456abcde'};

describe('/writers endpoints', () => {
    describe('POST /signup', () => {
        describe('when sending not valid writer data', () => {
            describe('when email is not valid', () => {
                it('should not register new writer', done => {
                    request
                        .post('/signup')
                        .set(inviteHeaders)
                        .send(Object.assign({}, writerData, {email: 'notvalid'}))
                        .expect(400)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');

                            let [ error ] = res.body.errors;
                            expect(error.message).to.equal('must be email format');
                        })
                        .end(done);
                });
            });

            describe('when some field is missed', () => {
                it('should not register new writer', done => {
                    request
                        .post('/signup')
                        .set(inviteHeaders)
                        .send({email: 'valid@example.com', 'password': 'qwerty'})
                        .expect(400)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');
                            expect(res.body.errors.length).to.equal(1);
                        })
                        .end(done);
                });
            });

            describe('when invitation code is wrong', () => {
                it('should not register new writer', done => {
                    request
                        .post('/signup')
                        .set(invalidInviteHeaders)
                        .send(writerData)
                        .expect(403)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');

                            let [ error ] = res.body.errors;
                            expect(error.message).to.equal('No valid invitation code');
                        })
                        .end(done);
                });
            });
        });

        describe('when creating non-existed writer', () => {
            it('should register and return new writer with access token', done => {
                request
                    .post('/signup')
                    .set(inviteHeaders)
                    .send(writerData)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.keys('accessToken', 'user');
                        expect(res.body.user).to.include.keys('_id', 'email', 'name', 'role');
                        expect(res.body.user.email).to.equal(writerData.email);
                    })
                    .end(done);
            });

            describe('when trying to create existed writer', () => {
                it('should return error', done => {
                    request
                        .post('/signup')
                        .set(inviteHeaders)
                        .send(writerData)
                        .expect(400)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');
                            expect(res.body.errors.length).to.equal(1);
                        })
                        .end(done);
                });
            });

            describe('POST /login', () => {
                describe('when login with valid credentianls', () => {
                    let validAccessToken;

                    it('should return writer and access token', done => {
                        request
                            .post('/login')
                            .send({email: writerData.email, password: writerData.password})
                            .expect(200)
                            .expect(res => {
                                expect(res.body).to.have.keys('accessToken', 'user');
                                expect(res.body.user).to.include.keys('_id', 'email', 'name', 'role');
                                expect(res.body.user.email).to.equal(writerData.email);

                                validAccessToken = res.body.accessToken;
                            })
                            .end(done);
                    });

                    describe('GET /me', () => {
                        describe('when requesting self info as authorized writer', () => {
                            it('should return writer', done => {
                                request
                                    .get('/me')
                                    .set({'x-access-token': validAccessToken})
                                    .expect(200)
                                    .expect(res => {
                                        expect(res.body.user).to.include.keys('_id', 'email', 'name', 'role');
                                        expect(res.body.user.email).to.equal(writerData.email);
                                    })
                                    .end(done);
                            });
                        });

                        describe('when requesting self info as non-authorized writers', () => {
                            it('should note return writer', done => {
                                request
                                    .get('/me')
                                    .set({'x-access-token': '12345'})
                                    .expect(401)
                                    .expect(res => {
                                        expect(res.body).to.have.keys('errors');
                                        expect(res.body.errors.length).to.equal(1);
                                        expect(res.body.errors[0].message).to.equal('User is not authorized');
                                    })
                                    .end(done);
                            });
                        });
                    });
                });

                describe('when trying to login with invalid email', () => {
                    it('should return error', done => {
                        request
                            .post('/login')
                            .send({email: 'notvalid', password: 'qwerty'})
                            .expect(400)
                            .expect(res => {
                                expect(res.body).to.have.keys('errors');
                                expect(res.body.errors.length).to.equal(1);
                            })
                            .end(done);
                    });
                });

                describe('when trying to login with invalid password', () => {
                    it('should return error', done => {
                        request
                            .post('/login')
                            .send({email: writerData.email, password: 'foo'})
                            .expect(400)
                            .expect(res => {
                                expect(res.body).to.have.keys('errors');
                                expect(res.body.errors.length).to.equal(1);
                            })
                            .end(done);
                    });
                });
            });
        });
    });

    describe('GET /articles', () => {
        let testWriter, authHeaders;

        describe('signup a new writer and create some articles', () => {
            before(async done => {
                try {
                    let { user, accessToken } = await getTestUser();
                    authHeaders = {'x-access-token': accessToken};
                    testWriter = user;
                    done();
                } catch (err) {
                    done(err);
                }
            });

            before(async done => {
                try {
                    await generateArticles(testWriter._id);
                    done();
                } catch (err) {
                    done(err);
                }
            });

            describe('when getting articles and writer is not logged in', () => {
                it('should return an error', done => {
                    request
                        .get('/articles')
                        .expect(401)
                        .end(done);
                });
            });

            describe('when getting articles for logged in writer', () => {
                it('should return an array of articles', done => {
                    request
                        .get(`/${testWriter._id}/articles`)
                        .set(authHeaders)
                        .expect(200)
                        .expect(res => {
                            expect(res.body).to.be.an('array');
                            expect(res.body).to.have.length(5);
                            expect(res.body[0].author).to.equal(testWriter._id);
                        })
                        .end(done);
                });
            });
        });
    });
});
