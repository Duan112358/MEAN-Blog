var _ = require('underscore'),
	path = require('path');

// Load app configuration

module.exports = {
	root: path.normalize(__dirname + '/..'),
	port: process.env.PORT || 3000,
    db: "mongodb://localhost/mean-dev",
    app: {
        "name": "MEAN - A Modern Stack"
    }   
}