var changeSpinnerSync = null;
var changeSpinnerAsync = null;

angular.module('app.controllers', [])
	.controller("MainCtrl", function($scope) {
		// start loading spinner
		// TODO: YOUR CODE HERE

		// controller functions to change visibility of loading spinner
		$scope.changeSpinnerSync = function(bool_value) {
			// TODO: YOUR CODE HERE
		};
		$scope.changeSpinnerAsync = function(bool_value) {
			// TODO: YOUR CODE HERE
		};
		// make them global variables so that other controllers can call this function
		// but at the same time still have the $scope that MainCtrl has
		changeSpinnerSync = $scope.changeSpinnerSync;
		changeSpinnerAsync = $scope.changeSpinnerAsync;

		// set starting tab
		$scope.active = "submited";

		// function which changes visible page according to which tab is active
		$scope.changeActive = function(label) {
			// TODO: YOUR CODE HERE
		}
	})
	.controller("ApplicationCtrl", function($scope, Applications) {
		// function which async calls submit function from Applications service
		$scope.submit = function() {
			changeSpinnerSync(true);
			var promise = null // TODO: REPLACE THIS LINE WITH YOUR CODE HERE
			return promise.catch(function(error) {
				alert(error.message);
				console.error(error);
			}).then(function() {
				changeSpinnerAsync(false);
				$scope.clear();
			});
		}

		// function clears all data from form inputs by clearing scope vars
		$scope.clear = function() {
			// TODO: YOUR CODE HERE
		}
	})
	.controller("SubmitedCtrl", function($scope, Applications) {
		// set applications to null so that bound html has something to reference
		$scope.applications = [];

		// async fetch submitted applications from firebase (using services) 
		// and bind results to scope variable
		Applications.getSubmited().catch(function(error) {
			alert(error.message);
			console.error(error);
		}).then(function(applications) {
			// rebind scope vars since its async function
			$scope.$apply(function() {
				// TODO: YOUR CODE HERE
				changeSpinnerSync(false);
			});
		});
	});