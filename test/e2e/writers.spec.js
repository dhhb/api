import supertest from 'supertest';

import { apiUrl, inviteSharedKey } from 'c0nfig';
import { createTestEmail, getTestUser, generateArticles } from '../testUtils';

let request = supertest(`${apiUrl}/writers`);
let writerData = {
    email: createTestEmail(),
    password: 'qwerty',
    firstName: 'John',
    lastName: 'Doe',
    role: 'artist'
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
                        .send({email: 'valid@example.com', 'password': 'qwerty'})
                        .expect(400)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');
                            expect(res.body.errors.length).to.equal(2);
                        })
                        .end(done);
                });
            });

            describe('when invitation code is wrong', () => {
                it('should not register new writer', done => {
                    request
                        .post('/signup')
                        .query(invalidInviteHeaders)
                        .send({email: 'valid@example.com', 'password': 'qwerty'})
                        .expect(401)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');

                            let [ error ] = res.body.errors;
                            expect(error.message).to.equal('No valid invitation code');
                        })
                        .end(done);
                });
            });
        });

        xdescribe('when creating non-existed writer', () => {
            it('should register and return new writer with access token', done => {
                request
                    .post('/signup')
                    .send(writerData)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).to.have.keys('accessToken', 'writers');
                        expect(res.body.user).to.have.keys('email', 'name', 'role');
                        expect(res.body.user.email).to.equal(writerData.email);
                    })
                    .end(done);
            });

            describe('when trying to create existed writers', () => {
                it('should return error', done => {
                    request
                        .post('/signup')
                        .send(writersData)
                        .expect(400)
                        .expect(res => {
                            expect(res.body).to.have.keys('errors');
                        })
                        .end(done);
                });
            });

            describe('POST /login', () => {
                describe('when login with valid credentianls', () => {
                    let validAccessToken;

                    it('should return writers and access token', done => {
                        request
                            .post('/login')
                            .send({email: writersData.email, password: writersData.password})
                            .expect(200)
                            .expect(res => {
                                expect(res.body).to.have.keys('accessToken', 'writers');
                                expect(res.body.writers).to.have.keys('email', 'firstName', 'lastName', 'role');
                                expect(res.body.writers.email).to.equal(writersData.email);

                                validAccessToken = res.body.accessToken;
                            })
                            .end(done);
                    });

                    describe('GET /me', () => {
                        describe('when requesting self info as authorized writers', () => {
                            it('should return writers and access token', done => {
                                request
                                    .get('/me')
                                    .set({'X-Access-Token': validAccessToken})
                                    .expect(200)
                                    .expect(res => {
                                        expect(res.body).to.have.keys('email', 'firstName', 'lastName', 'role');
                                        expect(res.body.email).to.equal(writersData.email);
                                    })
                                    .end(done);
                            });
                        });

                        describe('when requesting self info as non-authorized writers', () => {
                            it('should return writers and access token', done => {
                                request
                                    .get('/me')
                                    .set({'X-Access-Token': '12345'})
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
                            .send({email: writersData.email, password: 'foo'})
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

    xdescribe('GET /articles', () => {
        let testUser, authHeaders;

        describe('signup a new writers and create some items', () => {
            before(async done => {
                try {
                    let { writers, accessToken } = await getTestUser();
                    authHeaders = {'X-Access-Token': accessToken};
                    testUser = writers;
                    done();
                } catch (err) {
                    done(err);
                }
            });

            before(async done => {
                try {
                    await generateItems(testUser.email);
                    done();
                } catch (err) {
                    done(err);
                }
            });

            describe('when getting items and writers not logged in', () => {
                it('should return an error', done => {
                    request
                        .get('/items')
                        .expect(401)
                        .end(done);
                });
            });

            describe('when getting items for logged in writers', () => {
                it('should return an array of items', done => {
                    request
                        .get('/items')
                        .set(authHeaders)
                        .expect(200)
                        .expect(res => {
                            expect(res.body).to.be.an('array');
                            expect(res.body).to.have.length(5);
                            expect(res.body[0].owner).to.equal(testUser.email);
                        })
                        .end(done);
                });
            });
        });
    });
});
