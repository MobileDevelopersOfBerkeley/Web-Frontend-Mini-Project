angular.module('app.directives', [])
	.directive("filemodel", [function() {
		return {
			scope: {
				filemodel: "="
			},
			link: function(scope, element, attributes) {
				element.bind("change", function(changeEvent) {
					scope.$apply(function() {
						// bind file Blob to scope var
						scope.filemodel = changeEvent.target.files[0];
					});
				});
			}
		}
	}]);