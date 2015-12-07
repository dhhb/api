module.exports = {
    port: process.env.PORT || process.env.NODE_PORT || 7080,
    host: 'localhost',
    apiVersion: process.env.API_VERSION || 1,
    rootUrl: 'http://$(host):$(port)',
    apiUrl: '$(rootUrl)/v$(apiVersion)',
    webClientUrl: process.env.WEB_CLIENT_URL || 'http://$(host):7081',
    mongodb: {
        host: process.env.MONGODB_HOST || '$(host)',
        name: process.env.MONGODB_NAME || 'dhhb-dev',
        port: process.env.MONGODB_PORT || 27017,
        connection: 'mongodb://$(mongodb.host):$(mongodb.port)/$(mongodb.name)',
        options: {}
    },
    bcrypt: {
        hashRounds: 10
    },
    auth: {
        cookieName: 'dhhb_auth_token',
        signKey: 'b2811b87caa774ccf552e6abe95f424cc60224ee',
        tokenTTL: 1000 * 60 * 60 * 24 * 30, // 30 days
        resetPasswordTTL: 1000 * 60 * 60 * 24 // 1 day
    },
    userRoles: ['superuser', 'writer', 'reader']
};
