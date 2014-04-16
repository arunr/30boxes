var thirtyboxes = angular.module('thirtyboxes', ['angularMoment']);

thirtyboxes.factory('storageSvc', function ($window) {
	var storageSvc = {};
	var ls = $window.localStorage.getItem('thirtyboxes');
	if (ls !== null) {
		storageSvc.storage = JSON.parse(ls);		
	} else {
		storageSvc.storage = {};
	}
	
	storageSvc.setStorage = function(thing) {
		$window.localStorage.setItem('thirtyboxes', thing);
	};

	return storageSvc;
});


thirtyboxes.factory('dateSvc', function($window) {
	var dateSvc = {};
	var storage = {};
	var ls = $window.localStorage.getItem('thirtyboxes');
	if (ls !== null) {
		storage = JSON.parse(ls);		
	} else {
		storage = {};
	}	

	var feeling = function(day) {
		var max = "";
		function getMax(day) {
			var d = {
				happy: day.happy,
				angry: day.angry,
				energetic: day.energetic,
				sad: day.sad
			};

			return _.reduce(d, function(memo, num, key) { return num > memo.value ? {feeling:key, value:num} : memo; }, {feeling:'', value:0})
		}

		if (day === {}) {
			return '';
		} else {
			console.log(getMax(day));
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

	dateSvc.last6days = function(s) {
		var i, day, a_day, n_day = {};
		var days = [];

		for (i = 0; i < 6; i++)	 {
			day = moment().subtract('days', i);
			if (s) {
				a_day = s[day.format('L')] || {};
			} else {
				a_day = storage[day.format('L')] || {};	
			}
			
			a_day.feeling = feeling(a_day);		
			a_day.date = day.format('DD');
			a_day.long_date = day.format('L');
			days.push(a_day);
		}
		console.log(days);
		return days.reverse();
	};

	return dateSvc;
});

function BoxesCtrl($scope, $timeout, storageSvc, dateSvc) {
	$scope.show_message = false;
	$scope.show_details = false;
	$scope.selected_date = "";
	$scope.details = [];
	$scope.last6days = dateSvc.last6days(); 
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
		storageSvc.setStorage(JSON.stringify(storage));
		$scope.last6days = dateSvc.last6days(storage); 
		//console.log($scope.last6days);
	};

	$scope.show_day = function(date) {	
		$scope.show_details = true;
		$scope.selected_date = date;
		var storage = storageSvc.storage;
		$scope.details = _.filter(storage.log, function(item) {
			return moment(item.date).format('L') === date;
		}).reverse();
	};

	$scope.feeling_to_class = function(max) {
		//console.log(max);
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
