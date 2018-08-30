"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    app.controller("UsefulLinkController", ["$scope", "$http", "$q", "newsService", "sharedService", "$location","$window", "$timeout", "globalConfig", function ($scope, $http, $q, newsService, sharedService, $location, $window, $timeout, globalConfig) {
		
        $scope.currentYear = globalConfig.appCalendarYear;
        $scope.listName = globalConfig.appListName;



    }]); //controller
})(); //function