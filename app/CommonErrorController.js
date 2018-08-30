"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    app.controller("CommonErrorController", ["$scope", "$http", "$q", "newsService", "sharedService", "$location", "$timeout", "globalConfig", function ($scope, $http, $q, newsService, sharedService, $location, $timeout, globalConfig) {
		
        $scope.currentYear = globalConfig.appCalendarYear;
        $scope.listName = globalConfig.appListName;



    }]); //controller
})(); //function