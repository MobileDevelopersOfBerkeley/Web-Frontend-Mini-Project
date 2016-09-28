angular.module('app.directives', [])
	.directive("filemodel", [function() {
		return {
			scope: {
				filemodel: "="
			},
			link: function(scope, element, attributes) {
				element.bind("change", function(changeEvent) {
					scope.$apply(function() {
						scope.filemodel = changeEvent.target.files[0];
					});
				});
			}
		}
	}]);