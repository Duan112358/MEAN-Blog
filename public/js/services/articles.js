//Articles service used for articles REST endpoint
angular.module('mean.articles').factory("Articles", ['$resource',
    function($resource) {

        return $resource('articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            comment: {
                method: 'POST'
            }
        });
    }
]).factory('Tags', ['$resource',
    function($resource) {
        return $resource('tags/:tag', {
            tag: '@tag'
        });
    }
]);
