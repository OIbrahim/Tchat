var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, users, bcrypt) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(
        'local-login',
        new LocalStrategy(
            {
                'usernameField': 'username',
                'passwordField': 'password',
                'passReqToCallback': true
            },
            function (request, username, password, done) {
                if (!(username in users))
                    return done(null, false, request.flash('error', 'error'));

                if (!bcrypt.compareSync(password, users[username]))
                    return done(null, false, request.flash('error', 'error'));

                return done(null, username);
            }
        )
    );
};
