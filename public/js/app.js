var depends = ['jquery', 'bs', 'angular', 'bs_datepicker', 'pace', 'underscore', 'moment',
    'showdown', "md5", 'angular_pagination', 'angular_cookies', 'angular_resource',"bs_tagsinput",
    'angular_sanitize', "angular_file_upload"
];

var user_ctrls = ['article_ng_ctrl', 'header_ng_ctrl', 'index_ng_ctrl'];

require(depends, function(app) {
    angular.module('mean.system', []);
    angular.module('mean.articles', []);

    var angular_depends = ['ngCookies', 'ngSanitize', 'ngResource', 'ngFileUpload', 'ui.route'];
    var user_depends = ['mean.system', 'mean.articles'];

    window.app = angular.module('mean', angular_depends.concat(user_depends));

    //Setting up route
    window.app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/articles', {
                templateUrl: 'views/articles/list.html'
            }).
            when('/articles/create', {
                templateUrl: 'views/articles/create.html'
            }).
            when('/articles/:articleId/edit', {
                templateUrl: 'views/articles/edit.html'
            }).
            when('/articles/:articleId', {
                templateUrl: 'views/articles/view.html'
            }).
            when('/', {
                templateUrl: 'views/index.html'
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);

    require(user_ctrls, function() {
        //Setting HTML5 Location Mode
        window.app.config(['$locationProvider',
            function($locationProvider) {
                $locationProvider.hashPrefix("!");
            }
        ]);

        window.bootstrap = function() {
            angular.bootstrap(document, ['mean']);
        };

        $(document).ready(function() {
            //Fixing facebook bug with redirect
            if (window.location.hash == "#_=_") {
                window.location.hash = "";
            }

            window.bootstrap();
        });

    });
});
