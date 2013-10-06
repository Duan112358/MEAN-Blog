angular.module('ui.route', []).directive('uiRoute', ['$location', '$parse',
    function($location, $parse) {
        return {
            restrict: 'AC',
            scope: true,
            compile: function(tElement, tAttrs) {
                var useProperty;
                if (tAttrs.uiRoute) {
                    useProperty = 'uiRoute';
                } else if (tAttrs.ngHref) {
                    useProperty = 'ngHref';
                } else if (tAttrs.href) {
                    useProperty = 'href';
                } else {
                    throw new Error('uiRoute missing a route or href property on ' + tElement[0]);
                }
                return function($scope, elm, attrs) {
                    var modelSetter = $parse(attrs.ngModel || attrs.routeModel || '$uiRoute').assign;
                    var watcher = angular.noop;

                    // Used by href and ngHref

                    function staticWatcher(newVal) {
                        if ((hash = newVal.indexOf('#')) > -1) {
                            newVal = newVal.substr(hash + 1);
                        }
                        watcher = function watchHref() {
                            modelSetter($scope, ($location.path().indexOf(newVal) > -1));
                        };
                        watcher();
                    }
                    // Used by uiRoute

                    function regexWatcher(newVal) {
                        if ((hash = newVal.indexOf('#')) > -1) {
                            newVal = newVal.substr(hash + 1);
                        }
                        watcher = function watchRegex() {
                            var regexp = new RegExp('^' + newVal + '$', ['i']);
                            modelSetter($scope, regexp.test($location.path()));
                        };
                        watcher();
                    }

                    switch (useProperty) {
                        case 'uiRoute':
                            // if uiRoute={{}} this will be undefined, otherwise it will have a value and $observe() never gets triggered
                            if (attrs.uiRoute) {
                                regexWatcher(attrs.uiRoute);
                            } else {
                                attrs.$observe('uiRoute', regexWatcher);
                            }
                            break;
                        case 'ngHref':
                            // Setup watcher() every time ngHref changes
                            if (attrs.ngHref) {
                                staticWatcher(attrs.ngHref);
                            } else {
                                attrs.$observe('ngHref', staticWatcher);
                            }
                            break;
                        case 'href':
                            // Setup watcher()
                            staticWatcher(attrs.href);
                    }

                    $scope.$on('$routeChangeSuccess', function() {
                        watcher();
                        Pace.stop();
                    });

                    $scope.$on('$routeChangeStart', function() {
                        Pace.start();
                    });

                    //Added for compatibility with ui-router
                    $scope.$on('$stateChangeSuccess', function() {
                        watcher();
                        Pace.stop();
                    });
                };
            }
        };
    }
]);




var module = angular.module("mean.articles");
module.directive('btfMarkdown', function() {
    var converter = new Showdown.converter();
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            if (attrs.btfMarkdown) {
                scope.$watch(attrs.btfMarkdown, function(newVal) {
                    if (newVal) {
                        var html = converter.makeHtml(newVal);
                        element.html(html);
                    }
                });
            } else {
                var html = converter.makeHtml(element.text());
                element.html(html);
            }
        }
    };
});

module
//bind action before modal shown
//es: <html-tag class="modal-trigger" target-action(action(param)) target-modal('#modal_id')></html-tag>
.directive('modalTrigger', function($parse) {
    return {
        restrict: 'CA',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs) {
            var targetModal = angular.element(attrs.targetModal);
            if (targetModal) {
                element.bind('click', function() {
                    if (attrs.targetAction) {
                        scope.$eval(attrs.targetAction);
                        scope.$apply();
                    }

                    targetModal.modal('show');
                });
            }
        }
    };
})
//binding action before modal hidden
//es: <html-tag class="modal-hidder" target-action(action(param)) target-modal('#modal_id')></html-tag>
// hide-modal attribute has the highest priority
.directive('modalHidder', function() {
    return {
        restrict: 'CA',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs) {
            var targetModal = angular.element(attrs.targetModal);
            if (targetModal) {
                if (attrs.hideModal) {
                    scope.$watch(attrs.hideModal, function(value) {
                        if (value) {
                            targetModal.modal('hide');
                        }
                    });
                } else {
                    element.bind('click', function() {
                        if (attrs.targetAction) {
                            scope.$eval(attrs.targetAction);
                            scope.$apply();
                        }

                        var form = angular.element(attrs.targetModal + ' form');
                        if (form) {
                            if (!angular.element(attrs.targetModal + ' form input.ng-invalid').length) {
                                targetModal.modal('hide');
                            }
                        } else {
                            targetModal.modal('hide');
                        }
                    });
                }
            }
        }
    }
}).
directive('fileUploadTrigger', function() {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            var targetFileInput = angular.element(attrs.fileUploadTrigger);
            if (targetFileInput) {
                element.bind('click', function() {
                    targetFileInput.trigger('click');
                })
            }
        }
    }
}).
directive('timeAgo', function() {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            if (attrs.timeAgo) {
                scope.$watch(attrs.timeAgo, function(value) {
                    var timeAgo = moment(value).fromNow();
                    element.text(timeAgo);
                });
            }
        }
    }
}).
directive('gravatarImg', function() {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            if (attrs.gravatarImg) {
                scope.$watch(attrs.gravatarImg, function(value) {
                    element.attr('src', 'https://secure.gravatar.com/avatar/' + MD5(value) + '.png?s=60&amp;d=mm&amp;r=g')
                });
            }
        }
    }
}).
directive('commentTarget', function() {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            if (attrs.commentTarget) {
                var target = angular.element(attrs.commentTarget);
                var originalParent = target.parent();
                var appendTarget = angular.element(attrs.commentAppend);

                element.bind('click', function() {

                    scope.$watch(attrs.ngHide, function(value) {
                        if (!value) {
                            originalParent.append(target);
                        } else {
                            appendTarget.append(target);
                        }
                    })
                });
            }
        }
    }
});

module.directive('bsTagsInput', [
    function() {

        function getItemProperty(scope, property) {
            if (!property)
                return undefined;

            if (angular.isFunction(scope.$parent[property]))
                return scope.$parent[property];

            return function(item) {
                return item[property];
            };
        }

        return {
            restrict: 'EA',
            scope: {
                model: '=ngModel'
            },
            template: '<select multiple></select>',
            replace: false,
            link: function(scope, element, attrs) {
                $(function() {
                    var select = $('select', element);

                    select.tagsinput({
                        typeahead: {
                            source: angular.isFunction(scope.$parent[attrs.typeaheadSource]) ? scope.$parent[attrs.typeaheadSource] : null
                        },
                        itemValue: getItemProperty(scope, attrs.itemvalue),
                        itemText: getItemProperty(scope, attrs.itemtext),
                        tagClass: angular.isFunction(scope.$parent[attrs.tagclass]) ? scope.$parent[attrs.tagclass] : function(item) {
                            return attrs.tagclass;
                        }
                    });

                    if (scope.model == undefined || !angular.isArray(scope.model)) {
                        scope.model = [];
                    }

                    for (var i = 0; i < scope.model.length; i++) {
                        select.tagsinput('add', scope.model[i]);
                    }


                    select.on('itemAdded', function(event) {
                        if (scope.model.indexOf(event.item) === -1)
                            scope.model.push(event.item);

                        if (!scope.model || !scope.model.length) {
                            select.next().append('<span class="tag badge pull-right">add some tags</span>');
                        } else {
                            select.next().children('.pull-right').first().remove();
                        }
                    });

                    select.on('itemRemoved', function(event) {
                        var idx = scope.model.indexOf(event.item);
                        if (idx !== -1)
                            scope.model.splice(idx, 1);

                        if (!scope.model || !scope.model.length) {
                            select.next().append('<span class="tag badge pull-right">add some tags</span>');
                        } else {
                            select.next().children('.pull-right').first().remove();
                        }
                    });

                    // create a shallow copy of model's current state, needed to determine
                    // diff when model changes
                    var prev = scope.model.slice();
                    scope.$watch("model", function(value) {
                        var added = scope.model.filter(function(i) {
                            return prev.indexOf(i) === -1;
                        }),
                            removed = prev.filter(function(i) {
                                return scope.model.indexOf(i) === -1;
                            }),
                            i;

                        prev = scope.model.slice();

                        // Remove tags no longer in binded model
                        for (i = 0; i < removed.length; i++) {
                            select.tagsinput('remove', removed[i]);
                        }


                        // Refresh remaining tags
                        select.tagsinput('refresh');

                        // Add new items in model as tags
                        for (i = 0; i < added.length; i++) {
                            select.tagsinput('add', added[i]);
                        }

                        if (!scope.model || !scope.model.length) {
                            select.next().append('<span class="tag badge pull-right">add some tags</span>');
                        } else {
                            select.next().children('.pull-right').first().remove();
                        }
                    }, true);
                });
            }
        };
    }
]);

module.directive('editTarget', function() {
    return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            var target = angular.element(attrs.editTarget);
            element.bind('focus', function() {
                target.attr('rows', 1);
                element.attr('rows', 25);
            });
        }
    };
});

module.factory('keypressHelper', ['$parse',
    function keypress($parse) {
        var keysByCode = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'insert',
            46: 'delete'
        };

        var capitaliseFirstLetter = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        return function(mode, scope, elm, attrs) {
            var params, combinations = [];
            params = scope.$eval(attrs['ui' + capitaliseFirstLetter(mode)]);

            // Prepare combinations for simple checking
            angular.forEach(params, function(v, k) {
                var combination, expression;
                expression = $parse(v);

                angular.forEach(k.split(' '), function(variation) {
                    combination = {
                        expression: expression,
                        keys: {}
                    };
                    angular.forEach(variation.split('-'), function(value) {
                        combination.keys[value] = true;
                    });
                    combinations.push(combination);
                });
            });

            // Check only matching of pressed keys one of the conditions
            elm.bind(mode, function(event) {
                // No need to do that inside the cycle
                var altPressed = !! (event.metaKey || event.altKey);
                var ctrlPressed = !! event.ctrlKey;
                var shiftPressed = !! event.shiftKey;
                var keyCode = event.keyCode;

                // normalize keycodes
                if (mode === 'keypress' && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
                    keyCode = keyCode - 32;
                }

                // Iterate over prepared combinations
                angular.forEach(combinations, function(combination) {
                    var mainKeyPressed = combination.keys[keysByCode[event.keyCode]] || combination.keys[event.keyCode.toString()];

                    var altRequired = !! combination.keys.alt;
                    var ctrlRequired = !! combination.keys.ctrl;
                    var shiftRequired = !! combination.keys.shift;

                    if (
                        mainKeyPressed &&
                        (altRequired == altPressed) &&
                        (ctrlRequired == ctrlPressed) &&
                        (shiftRequired == shiftPressed)
                    ) {
                        // Run the function
                        scope.$apply(function() {
                            combination.expression(scope, {
                                '$event': event
                            });
                        });
                    }
                });
            });
        };
    }
]);
/**
 * Bind one or more handlers to particular keys or their combination
 * @param hash {mixed} keyBindings Can be an object or string where keybinding expression of keys or keys combinations and AngularJS Exspressions are set. Object syntax: "{ keys1: expression1 [, keys2: expression2 [ , ... ]]}". String syntax: ""expression1 on keys1 [ and expression2 on keys2 [ and ... ]]"". Expression is an AngularJS Expression, and key(s) are dash-separated combinations of keys and modifiers (one or many, if any. Order does not matter). Supported modifiers are 'ctrl', 'shift', 'alt' and key can be used either via its keyCode (13 for Return) or name. Named keys are 'backspace', 'tab', 'enter', 'esc', 'space', 'pageup', 'pagedown', 'end', 'home', 'left', 'up', 'right', 'down', 'insert', 'delete'.
 * @example <input ui-keypress="{enter:'x = 1', 'ctrl-shift-space':'foo()', 'shift-13':'bar()'}" /> <input ui-keypress="foo = 2 on ctrl-13 and bar('hello') on shift-esc" />
 **/
module.directive('uiKeydown', ['keypressHelper',
    function(keypressHelper) {
        return {
            link: function(scope, elm, attrs) {
                keypressHelper('keydown', scope, elm, attrs);
            }
        };
    }
]);

module.directive('uiKeypress', ['keypressHelper',
    function(keypressHelper) {
        return {
            link: function(scope, elm, attrs) {
                keypressHelper('keypress', scope, elm, attrs);
            }
        };
    }
]);

module.directive('uiKeyup', ['keypressHelper',
    function(keypressHelper) {
        return {
            link: function(scope, elm, attrs) {
                keypressHelper('keyup', scope, elm, attrs);
            }
        };
    }
]);
