"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    app.controller("DivPageController", ["$scope", "$http", "miscService", "sharedService", "$location","$filter", "$timeout", "$routeParams", "globalConfig", "blockUI",  function ($scope, $http, miscService, sharedService, $location, $filter, $timeout, $routeParams, globalConfig, blockUI) {
		                        
//##########################################################################################################################
//### Global Variables & INIT function callback###
//### Handle Accordion collapse and expand ###
    $scope.currentYear = globalConfig.appCalendarYear;
    $scope.listName = globalConfig.appListName;
    
    $scope.HomeForm = function() {
        $location.path('/');
    };

    var divisionIndex = -1;
    var display = '';
    $scope.Division=[];
    miscService.getDivisionList().then(function (response) {
        for (var i=0;i<response.d.results.length;i++)
        {
            display = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
            $scope.Division.push(display);
        } 
    });

    var programTypeIndex = -1;
    var programType = '';
    $scope.ProgramType=[];
    miscService.getProgramTypeList().then(function (response) {
        for (var i=0;i<response.d.results.length;i++)
        {
            programType = {id: response.d.results[i].ProgramType, text: response.d.results[i].ProgramType};
            $scope.ProgramType.push(programType);
        } 
    });    

	angular.element(document).ready(function () {            
 		blockUI.start("Loading......");	 
		miscService.getAllPageHeader().then(function (response) {
			$timeout( function()
			{
				blockUI.stop();			
                $scope.master = response.d.results;	
                $scope.total = response.d.results.length;
			 }, 500);             
		});
	});

//##########################################################################################################################


//##########################################################################################################################
//### division OnChange ###
    $scope.divisionOnChange = function(selectedDivision, selectedType) {
        var divisionIndex = -1;       
        var programTypeIndex = -1;       

        var divisionId = (selectedDivision == null ? '' : selectedDivision.id);
        var typeId = (selectedType == null ? '' : selectedType.id);
 
        blockUI.start("Loading......");	 
		miscService.getFilteredPageHeader(divisionId, typeId).then(function (response) {
			$timeout( function()
			{
				blockUI.stop();
                $scope.master = response.d.results;
                $scope.total = response.d.results.length;
			 }, 500);    
        }).then(function () {
            angular.forEach($scope.Division, function(value, key){
                if(value.id == divisionId) {
                    divisionIndex =  key;
                }
            });
            $scope.selectedDivision = $scope.Division[divisionIndex];                     
        });    
    }
//##########################################################################################################################

    }]); //controller
})(); //function