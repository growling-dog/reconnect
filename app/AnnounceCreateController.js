"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    
    
    
    app.controller("AnnounceCreateController", ["$scope", "$http", "AnnounceService", "sharedService", "$location","$filter", "$timeout", "globalConfig", "blockUI", function ($scope, $http, AnnounceService, sharedService, $location, $filter, $timeout, globalConfig, blockUI) {
//##########################################################################################################################
//### Global Variables ###

		console.log("AnnounceCreateController!!!");
		var sText;

		$scope.currentYear = globalConfig.appCalendarYear;
		$scope.listName = "Announcement";//globalConfig.appListName;
		$scope.master = {};
		$scope.currentYear = globalConfig.appCalendarYear;
		$scope.isSaving = undefined;

		$scope.CustomValidator = {
			isValidDate : true
		};
		
		$scope.Division=[];
		AnnounceService.getDivisionList().then
		(
			function (response) 
			{
		  		for (var i=0;i<response.d.results.length;i++)
				{
					sText = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
					$scope.Division.push(sText);
				}
				
			
			}
		);
		

		/*$scope.Division= [
				{id: 'FIN', text: 'Asset Management / Finance'},
				{id: 'CSR', text: 'Corporate Social Responsibility'},
				{id: 'DEV', text: 'Development'},
				{id: 'ENG', text: 'Engineering'},
				{id: 'EXO', text: 'Executive Office'},
				{id: 'FNB', text: 'Food and Beverage'},
				{id: 'JEN', text: 'Hotel Jen'},
				{id: 'HRD', text: 'Human Resources'},
				{id: 'ITD', text: 'Information Technology'},
				{id: 'LEG', text: 'Legal'},
				{id: 'PUR', text: 'Purchasing'},
				{id: 'QI', text: 'Quality Improvement'},
				{id: 'RET', text: 'Retail'},
				{id: 'RMS', text: 'Rooms'},
				{id: 'MKT', text: 'Sales & Marketing'},
				{id: 'SEC', text: 'Secretariat'},                
                {id: 'STY', text: 'Security'},
                {id: 'SPA', text: 'Spa'}                         
			];
		*/
		$scope.CancelForm = function() {
			$location.path('/AnnounceMain'); 
		};
//##########################################################################################################################


//##########################################################################################################################
//### SubmitForm ###
		$scope.SubmitForm = function (master) {
		//	alert("Submit Form start");
		
			var today = new Date();
			var todayFormatted = $filter('date')(today,'yyyy-MM-dd');
			var thisExpiryDate = $filter('date')(master.ExpiryDate,'yyyy-MM-dd');
			$scope.CustomValidator.isValidDate = sharedService.validateDateObjects(todayFormatted,thisExpiryDate);

			blockUI.start("Loading ......");
			$scope.master = {};
			$scope.isSaving = true;
			
			
			
			AnnounceService.createNews(master)
			.then(function(response) {
				$timeout( function()
				{
					blockUI.stop();
					$scope.isSaving = false;
					$location.path('/AnnounceEdit/'+response.d.Id);
				}, 1000);
			});
		};
//##########################################################################################################################


//##########################################################################################################################
//### getDocumentById ###
		$scope.getDocumentById = function(filedata) {
			AnnounceService.getById().then(function (response) {
				$scope.master = {
					Id : response.d.Id,
					AttachmentFiles: response.d.AttachmentFiles 
				};
				$scope.master.AttachmentFiles.results.push(filedata);
			});
		};
//##########################################################################################################################

    }]); //controller
})(); //function