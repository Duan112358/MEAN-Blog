var async = require('async');

module.exports = function(app, passport, auth) {
    //User Routes
    var users = require('../app/controllers/users');
    var uploader = require('../app/controllers/uploader');

    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);

    //Setting up the users api
    app.post('/users', users.create);


    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    app.get('/users/me', users.me);
    app.get('/users/:userId', users.show);

    
    //Finish with setting up the userId param
    app.param('userId', users.user);

    app.get('/upload/:user',uploader.show);
    app.post('/upload', uploader.upload);
    app.del('/upload/:imageId',auth.requiresLogin, uploader.destroy);
    app.post('/upload/query', uploader.queryByDate);
    app.param('user', uploader.getFiles);

    //Article Routes
    var articles = require('../app/controllers/articles');
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/tags/:tag',articles.show);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.post('/articles/:articleId', articles.update);
    app.del('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    app.param('tag',articles.queryByTag);
    //Finish with setting up the articleId param
    app.param('articleId', articles.article);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);
};
