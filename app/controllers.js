var changeSpinnerSync = null;
var changeSpinnerAsync = null;

angular.module('app.controllers', [])
	.controller("MainCtrl", function($scope) {
		// start loading spinner
		$scope.loading = true;

		// controller functions to change visibility of loading spinner
		$scope.changeSpinnerSync = function(bool_value) {
			$scope.loading = bool_value;
		};
		$scope.changeSpinnerAsync = function(bool_value) {
			$scope.$apply(function() {
				$scope.loading = bool_value;
			});
		};
		// make them global variables so that other controllers can call this function
		// but at the same time still have the $scope that MainCtrl has
		changeSpinnerSync = $scope.changeSpinnerSync;
		changeSpinnerAsync = $scope.changeSpinnerAsync;

		// set starting tab
		$scope.active = "submited";

		// function which changes visible page according to which tab is active
		$scope.changeActive = function(label) {
			$scope.active = label;
		}
	})
	.controller("ApplicationCtrl", function($scope, Applications) {
		// function which async calls submit function from Applications service
		// starts spinner before call
		// stops spinner after call
		$scope.submit = function() {
			changeSpinnerSync(true);
			return Applications.submit($scope.name, $scope.age, $scope.kewl, $scope.resume).catch(function(error) {
				alert(error.message);
				console.error(error);
			}).then(function() {
				changeSpinnerAsync(false);
				$scope.clear();
			});
		}

		$scope.clear = function() {
			$scope.name = "";
			$scope.age = 0;
			$scope.kewl = false;
			$scope.resume = undefined;
		}
	})
	.controller("SubmitedCtrl", function($scope, Applications) {
		// set applications to null so that bound html has something to reference
		$scope.applications = [];

		// async fetch submitted applications from firebase (using services) 
		// and bind results to scope variable
		// stop loading after async call
		Applications.getSubmited().catch(function(error) {
			alert(error.message);
			console.error(error);
		}).then(function(applications) {
			// rebind scope vars since its async function
			$scope.$apply(function() {
				$scope.applications = applications;
				changeSpinnerSync(false);
			});
		});
	});