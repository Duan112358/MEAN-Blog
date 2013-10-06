//Articles service used for articles REST endpoint
angular.module('mean.articles').service("Uploader", ['$http',
    function($http) {
        return {
            upload: function(file, callback) {
                $http.uploadFile({
                    url: '/upload',
                    file: file
                }).success(function(data) {
                    callback(data);
                }).error(function(err, status) {
                    callback({
                        Error: err,
                        Status: status
                    });
                })
            },
            getFiles: function(userId, callback) {
                var url = '/upload/' + userId;
                $http.get(url).success(function(data) {
                    callback(data);
                }).error(function(err, status) {
                    callback({
                        Error: err,
                        Status: status
                    });
                });
            },
            query: function(query, callback) {
                var url = '/upload/query';
                $http.post(url, query).success(function(data) {
                    callback(data);
                }).error(function(err, status) {
                    callback({
                        Error: err,
                        Status: status
                    });
                });
            }
        };
    }
]);
