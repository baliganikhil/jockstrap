var Jockstrap = angular.module('Jockstrap', []);

Jockstrap.directive('accordion', function() {
	return {
		restrict: 'E',
		scope: {
			switch: "@"
		},
		transclude: true,
		compile: function(element, attrs, transclude) {
			return function($scope) {
				transclude($scope, function(clone) {
					var name = angular.element(element[0].outerHTML)[0].dataset['name'];

					var final_element = [];

					for (k in clone) {
						e = clone[k];
						e = angular.element(e);

						try{
							if (e.hasClass('set')) {
								e.attr("ng-class", "{active: " + name + " == '" + e[0].dataset.show + "'}");

								var html = e[0].innerHTML;
								html = angular.element(html);

								var header = html[0].outerHTML;

								header.attr('ng-click', name + " = '" + html[0].dataset.show + "'");
								html.find('.body').attr('ng-show', name + " == '" + html[0].dataset.show + "'");
                                console.log(header)

								final_element.push(e);
							}
						} catch(e) {

						}
					}

					var html = '<div class="accordion">';

					final_element.forEach(function(e) {
						html += e[0].outerHTML;
					});

					html += '</div>';

					element[0].innerHTML = html;

				});
			};
		}
	};
});

Jockstrap.directive('dropdown', function() {
	return {
		restrict: 'E',
		scope: {
			src: "=",
			text: "@",
			onclick: "&"
		},
		templateUrl: './templates/dropdown.html'
	};
});

Jockstrap.directive('autocomplete', ['$timeout', function($timeout) {
    return {
        restrict: 'AE',
        templateUrl: "./templates/autocomplete.html",
        scope: {
            options: "=",
            selected: "=",
            placeholder: "@"
        },
        link: function($scope, element, attrs, controller) {
            var KEY_UP = 38;
            var KEY_DOWN = 40;
            var ENTER = 13;

            $scope.show_dd = false;

            $scope.active_value = '';
            $scope.active_key = -1;

            var focus = false;

            var textbox = angular.element(element[0].querySelector('.txt_autocomplete'));

            textbox.bind('keydown', function(e) {
                if (e.keyCode === KEY_UP) {
                    if ($scope.active_key > -1) {
                        $scope.active_key -= 1;
                    }
                } else if (e.keyCode == KEY_DOWN) {
                    if ($scope.active_key < $scope.filtered_options.length - 1) {
                        $scope.active_key += 1;
                    } else {
                        $scope.active_key = 0;
                    }
                } else if (e.keyCode == ENTER) {
                    if ($scope.active_key > -1) {
                        $scope.selected = $scope.filtered_options[$scope.active_key];
                    }
                }

                $scope.$apply();
            });

            textbox.bind('focus', function() {
                focus = true;
                $scope.active_key = -1;

                if ($scope.options && $scope.options.length > 0) {
                    $scope.show_dd = true;
                }

                $scope.$apply();
            });

            $scope.$watch('options', function() {
                $scope.active_key = -1;

                if ($scope.options && $scope.options.length > 0 && focus) {
                    $scope.show_dd = true;
                }

            }, true);

            $scope.$watch('filtered_options', function() {
                if ($scope.filtered_options && $scope.filtered_options.length === 0) {
                    $scope.show_dd = false;
                }
            }, true);

            textbox.bind('blur', function() {
                focus = false;
                $timeout(function() {
                    $scope.show_dd = false;
                    $scope.$apply();

                }, 100);
            });

            $scope.set_value = function(value) {
                $scope.selected = value;
            };

        }
    };
}]);

Jockstrap.directive('lov', ['$compile', function($compile) {
    return {
        restrict: 'E',
        templateUrl: './templates/lov.html',
        scope: {
            options: '=',
            selected: '=',
            onadd: '=',
            extras: '='
        },
        link: function($scope, element, attrs, controller) {
            $scope.show_modal = false;

            if (typeof $scope.options !== 'object') {
                $scope.options = [];
            }

            if ([undefined, null].indexOf($scope.extras) > -1) {
                $scope.extras = {};
            }

            $scope.show_modal = function() {
                $scope.lov_modal_show = true;
            };

            $scope.set_selected = function(v) {
                $scope.selected = v;
                $scope.lov_modal_show = false;
            };

            $scope.on_new_value_added = function(v) {
                $scope.onadd(v, $scope.extras);
            };
        }
    };
}]);