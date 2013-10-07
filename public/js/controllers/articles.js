angular.module('mean.articles').controller('ArticlesController', ['$scope', '$timeout', '$routeParams', '$location', 'Global', 'Articles', 'Uploader', 'Tags',
    function($scope, $timeout, $routeParams, $location, Global, Articles, Uploader, Tags) {
        $scope.global = Global;

        $scope.create = function() {
            var article = new Articles({
                title: this.title,
                content: this.content,
                markdown: this.markdown
            });
            article.$save(function(response) {
                $location.path("articles/" + response._id);
            });

            this.title = "";
            this.markdown = false;
            this.content = "";
        };

        $scope.confirmDelete = function() {
            $scope.articleToDelete.$remove();

            for (var i in $scope.articles) {
                if ($scope.articles[i]._id == scope.articleToDelete._id) {
                    $scope.articles.splice(i, 1);
                }
            }
        };

        $scope.remove = function(article) {
            $scope.articleToDelete = article;
        };

        $scope.update = function() {
            var article = $scope.article;
            if (!article.updated) {
                article.updated = [];
            }
            article.updated.push(new Date().getTime());

            article.$update(function() {
                $location.path('articles/' + article._id);
            });
        };

        $scope.find = function(query) {
            var tag = $routeParams.tag;
            $scope.currenttag = tag;
            if (tag) {
                Tags.query({
                    tag: tag
                }, function(articles) {
                    $scope.articles = articles;
                })
            } else {
                Articles.query(query, function(articles) {
                    $scope.articles = articles;
                });
            }
        };

        $scope.findOne = function() {
            Articles.get({
                articleId: $routeParams.articleId
            }, function(article) {
                article.votes = article.votes + 1;
                $scope.article = article;
            });
        };

        $scope.$watch('article.votes', function(value){
            if (!$scope.execuing) {
                $scope.execuing = true;
                $timeout(function() {
                    $scope.article.$comment(function() {});
                    $scope.execuing = false;
                }, 10000);
            }
        });

        $scope.upload = function($files) {
            if ($files && $files.length) {
                Uploader.upload($files[0], function(data) {
                    $scope.fileslist.push(data);
                });
            }
        };

        $scope.getUploads = function(date) {
            if (!date) {
                date = moment().add('days', -3).format();
            }
            Uploader.query({
                date: date
            }, function(files) {
                $scope.fileslist = files;
            });
        };

        $scope.makeComment = function() {

            var article = $scope.article;
            article.comments.push($scope.comment);

            if (!article.updated) {
                article.updated = [];
            }

            article.updated.push(new Date().getTime());

            article.$comment(function() {
                $location.path('articles/' + article._id);
                $scope.comment = {};
            });
        }
    }
]);
