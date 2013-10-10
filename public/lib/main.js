require.config({
    baseUrl: "../",
    paths: {
        "jquery": "lib/utils/jquery-2.0.3",
        "bs": "lib/utils/bootstrap",
        "bs_datepicker": "lib/utils/bootstrap-datepicker",
        "bs_tagsinput": "lib/utils/bootstrap-tagsinput",
        "pace": "lib/utils/pace",
        "md5": "lib/utils/md5",
        "underscore": "lib/underscore/underscore",
        "moment": "lib/moment/moment",
        "showdown": "lib/showdown/src/showdown",
        "angular": "lib/angular/angular",
        "angular_pagination": "lib/angular-pagination/angular-bs-pagination",
        "angular_resource": "lib/angular-resource/angular-resource",
        "angular_cookies": "lib/angular-cookies/angular-cookies",
        "angular_file_upload": "lib/angular-fileupload/angular-file-upload",
        "angular_sanitize": "lib/angular-sanitize/angular-sanitize",
        "ng_directives": "js/directives",
        "global_ng_service": "js/services/global",
        "article_ng_service": "js/services/articles",
        "upload_ng_service": "js/services/upload",
        "article_ng_ctrl": "js/controllers/articles",
        "header_ng_ctrl": "js/controllers/header",
        "index_ng_ctrl": "js/controllers/index",
        "app": "js/app"
    },
    shim: {
        "bs": ["jquery"],
        "bs_datepicker": ["jquery", "bs"],
        "bs_tagsinput": ["jquery", "bs"],
        "bs_paginator": ["jquery"],
        "angular": {
            'exports': 'angular'
        },
        "angular_mocks": ["angular"],
        "angular_resource": ["angular"],
        "angular_animate": ["angular"],
        "angular_sanitize": ["angular"],
        "angular_file_upload": ["angular"],
        "angular_cookies": ["angular"],
        "angular_pagination": ["angular"],
        "ng_directives": ["angular", "app"],
        "global_ng_service": ["angular", "app"],
        "article_ng_service": ["angular", "app"],
        "upload_ng_service": ["angular", "app"],
        "article_ng_ctrl": ["angular", "app", "ng_directives", "global_ng_service", "upload_ng_service", "article_ng_service"],
        "header_ng_ctrl": ["angular", "app", "ng_directives", "global_ng_service"],
        "index_ng_ctrl": ["angular", "app", "ng_directives", "global_ng_service"],
    },
    priority: ["angular"]
});

require(['app'], function(app) {});
