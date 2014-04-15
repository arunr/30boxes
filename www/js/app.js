var thirtyboxes = angular.module('thirtyboxes', ['angularMoment']);

thirtyboxes.factory('storageSvc', function ($window) {
	var storageSvc = {};
	storageSvc.storage = JSON.parse($window.localStorage.getItem('thirtyboxes')) || {};	
	storageSvc.setStorage = function(thing) {
		$window.localStorage.setItem('thirtyboxes', thing);
	};

	return storageSvc;
});


thirtyboxes.factory('dateSvc', function($window) {
	var dateSvc = {};
	var storage = JSON.parse($window.localStorage.getItem('thirtyboxes')) || {};	

	var feeling = function(day) {
		var max = "";
		function getMax(day) {
			return _.reduce(day, function(memo, num, key) { return num > memo.value ? {feeling:key, value:num} : memo; }, {feeling:'', value:0})
		}

		if (day === {}) {
			return '';
		} else {
			max = getMax(day).feeling;
			if (max === 'happy') {
				return 'success';
			} else if (max === 'sad') {
				return 'primary';
			} else if (max === 'angry') {
				return 'danger';
			} else if (max === 'energetic') {
				return 'warning'
			} else {
				return '';
			}
		}
	};

	dateSvc.last6days = function() {
		var i, day, a_day;
		var days = [];

		for (i = 0; i < 6; i++)	 {
			day = moment().subtract('days', i);
			a_day = storage[day.format('L')] || {};
			a_day.feeling = feeling(a_day);		
			a_day.date = day.format('DD');
			a_day.long_date = day.format('L');
			days.push(a_day);
		}
		return days.reverse();
	};

	return dateSvc;
});

function BoxesCtrl($scope, $timeout, storageSvc, dateSvc) {
	$scope.show_message = false;
	$scope.show_details = false;
	$scope.selected_date = "";
	$scope.details = [];
	$scope.log = function(state) {
		$scope.show_message = true;
		$timeout(function() {
			$scope.show_message=false;
		}, 3000);

		var today = moment().format('L');
		var storage = storageSvc.storage;
		storage.log = storage.log || [];
		storage.log.push({
			date: Date.now(),
			feeling: state			
		});

		storage[today] = storage[today] || {};
		storage[today][state] = storage[today][state] + 1 || 1;
		console.log(storage);
		storageSvc.setStorage(JSON.stringify(storage));
	};

	var last6 = dateSvc.last6days();
	$scope.last6days = function() {
		return last6;
	}

	$scope.show_day = function(date) {	
		$scope.show_details = true;
		$scope.selected_date = date;
		var storage = storageSvc.storage;
		$scope.details = _.filter(storage.log, function(item) {
			return moment(item.date).format('L') === date;
		}).reverse();
	};

	$scope.feeling_to_class = function(max) {
		console.log(max);
		if (max === 'happy') {
			return 'success';
		} else if (max === 'sad') {
			return 'primary';
		} else if (max === 'angry') {
			return 'danger';
		} else if (max === 'energetic') {
			return 'warning'
		} else {
			return '';
		}
	}
}
