"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    app.controller("NewsCreateController", ["$scope", "$http", "newsService", "sharedService", "$location","$filter", "$timeout", "globalConfig", "blockUI", function ($scope, $http, newsService, sharedService, $location, $filter, $timeout, globalConfig, blockUI) {
//##########################################################################################################################
//### Global Variables ###
		$scope.currentYear = globalConfig.appCalendarYear;
		$scope.listName = globalConfig.appListName;
		$scope.master = {};
		$scope.currentYear = globalConfig.appCalendarYear;
		$scope.isSaving = undefined;

		$scope.CustomValidator = {
			isValidDate : true
		};

		var divisionIndex = -1;
		var display = '';
		$scope.Division=[];
		newsService.getDivisionList().then(function (response) {
			for (var i=0;i<response.d.results.length;i++)
			{
				display = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
				$scope.Division.push(display);
			} 
		});

		$scope.CancelForm = function() {
			$location.path('/NewsMain'); 
		};
		
//##########################################################################################################################


//##########################################################################################################################
//### SubmitForm ###
		$scope.SubmitForm = function (master) {
			var today = new Date();
			var todayFormatted = $filter('date')(today,'yyyy-MM-dd');
			var thisExpiryDate = $filter('date')(master.ExpiryDate,'yyyy-MM-dd');
			$scope.CustomValidator.isValidDate = sharedService.validateDateObjects(todayFormatted,thisExpiryDate);

			if($scope.CustomValidator.isValidDate) {
				blockUI.start("Loading......");
				$scope.master = {};
				$scope.isSaving = true;
				newsService.createNews(master)
				.then(function(response) {
					$timeout( function()
					{
						blockUI.stop();
						$scope.isSaving = false;
						$location.path('/NewsEdit/'+response.d.Id);
					}, 1000);
				});				
			}
		};
//##########################################################################################################################


    }]); //controller
})(); //function