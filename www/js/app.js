var thirtyboxes = angular.module('thirtyboxes', []);

function BoxesCtrl($scope, $window) {
	$scope.log = function(state) {
		var date = new Date;
		var today = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay();	
		var storage = JSON.parse($window.localStorage.getItem('thirtyboxes')) || {};	
		storage[today] = storage[today] || {};
		storage[today][state] = storage[today][state] + 1 || 1;
		console.log(storage);
		$window.localStorage.setItem('thirtyboxes', JSON.stringify(storage));
	};
}
