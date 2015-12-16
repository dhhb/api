import User from '../../src/v1/models/User';
import { createTestUserData } from '../testUtils';

describe('User model static methods', () => {
    let userData = createTestUserData();
    let token;

    describe('when generating access token', () => {
        before(() => token = User.generateAccessToken(userData));

        it('should return access token string', () => {
            expect(token).to.be.a('string');
        });

        describe('when validating access token', function () {
            let validUserData;

            before(() => validUserData = User.validateAccessToken(token));

            it('should return user _id used for this token', () => {
                expect(validUserData._id).to.equal(userData._id);
            });

            it('should return user email used for this token', () => {
                expect(validUserData.email).to.equal(userData.email);
            });

            it('should return user role used for this token', () => {
                expect(validUserData.role).to.equal(userData.role);
            });
        });
    });
});
