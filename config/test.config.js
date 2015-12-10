module.exports = {
    port: process.env.PORT || process.env.NODE_PORT || 7088,
    host: 'localhost',
    apiVersion: process.env.API_VERSION || 1,
    rootUrl: 'http://$(host):$(port)',
    apiUrl: '$(rootUrl)/v$(apiVersion)',
    webClientUrl: process.env.WEB_CLIENT_URL || 'http://$(host):7081',
    mongodb: {
        host: process.env.MONGODB_HOST || '$(host)',
        name: process.env.MONGODB_NAME || 'dhhb-test',
        port: process.env.MONGODB_PORT || 27017,
        connection: 'mongodb://$(mongodb.host):$(mongodb.port)/$(mongodb.name)',
        options: {}
    },
    bcrypt: {
        hashRounds: 1
    },
    auth: {
        cookieName: 'dhhb_auth_token',
        signKey: 'c88afe1f6aa4b3c7982695ddd1cdd200bcd96662',
        tokenTTL: 1000 * 60 * 60 * 24 * 30, // 30 days
        resetPasswordTTL: 1000 * 60 * 60 * 24 // 1 day
    },
    userRoles: ['superuser', 'writer', 'reader'],
    inviteSharedKey: '9a7e87e48d619dd4751d6543f8fbbfec498b728b'
};
