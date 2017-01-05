module.exports = function (app, passport) {
    app.get('/login', function (request, response) {
        response.render('login.ejs', { 'error': request.flash('error') });
    });

    app.post('/login', passport.authenticate('local-login', {
            'failureRedirect': '/login',
            'failureFlash': true
        }),
        function (request, response) {
            if (request.user === 'Admin')
                response.redirect('/admin');
            else response.redirect('/client');
        }
    );

    app.get('/client', isLoggedIn, function (request, response) {
        response.render('client.ejs', {
            'username': request.user
        });
    });

    app.get('/admin', isLoggedIn, function (request, response) {
        if (request.user === 'Admin') {
            response.render('admin.ejs', {
                'username': request.user
            });
        }
        else response.redirect('/client');            
    });

    app.get('/logout', function (request, response) {
        request.logout();
        response.redirect('/login');
    });
};

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated())
        return next();
    response.redirect('/login');
}
