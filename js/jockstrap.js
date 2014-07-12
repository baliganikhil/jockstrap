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