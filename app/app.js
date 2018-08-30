"use strict";
(function () {
	var app = angular.module("ReConnectApp",["ngRoute","ui.bootstrap","ui.bootstrap.datetimepicker","angular.filter","ngMessages","xeditable","ngAnimate","ngSanitize","ngFileUpload","angularUtils.directives.dirPagination", "blockUI", "ngDialog"]);
	
	app.value("globalConfig", {
		appName: "ReConnect",
		appVersion: "1.0",
		appDomain: "https://shangrila.sharepoint.com",
		appSiteCollection: "reconnect",
		appListName: "CorporateNews",
		appNewsListId: "0649FD4A-9ACB-4188-B242-F030D4FCF3F9",
		appAnnounceListId: "d0207c56-1e44-40ae-83af-401f44cfeb28",
		appDivPageListName: "DivisionPage",
		appCalendarYear: new Date().getFullYear()
	});

	app.config(["$routeProvider", function ($routeProvider) {
		$routeProvider.when("/", {
			templateUrl: "../SiteAssets/reconnect/templates/home.html",
			controller: "homeController"		
		}).when("/NewsCreate", {
			templateUrl: "../SiteAssets/reconnect/templates/NewsCreate.html",
			controller: "NewsCreateController"
		}).when("/NewsEdit/:itemID", {
			templateUrl: "../SiteAssets/reconnect/templates/NewsEdit.html",
			controller: "NewsEditController"
		}).when("/NewsDetail/:itemID", {
			templateUrl: "../SiteAssets/reconnect/templates/NewsDetail.html",
			controller: "NewsDetailController"			
		}).when("/NewsMain", {
			templateUrl: "../SiteAssets/reconnect/templates/NewsMain.html",
			controller: "NewsMainController"
		}).when("/DivPage", {
			templateUrl: "../SiteAssets/reconnect/templates/DivPage.html",
			controller: "DivPageController"	
		}).when("/UsefulLink", {
			templateUrl: "../SiteAssets/reconnect/templates/UsefulLink.html",
			controller: "UsefulLinkController"	
		}).when("/AnnounceMain", {
			templateUrl: "../SiteAssets/reconnect/templates/AnnounceMain.html",
			controller: "AnnounceMainController"
		}).when("/AnnounceCreate", {
			templateUrl: "../SiteAssets/reconnect/templates/AnnounceCreate.html",
			controller: "AnnounceCreateController"
		}).when("/AnnounceEdit/:itemID", {
			templateUrl: "../SiteAssets/reconnect/templates/AnnounceEdit.html",
			controller: "AnnounceEditController"
		}).when("/AnnounceDetail/:itemID", {
			templateUrl: "../SiteAssets/reconnect/templates/AnnounceDetail.html",
			controller: "AnnounceDetailController"											
		}).when("/CommonError", {
			templateUrl: "../SiteAssets/reconnect/templates/CommonError.html",
			controller: "CommonErrorController"												
		}).otherwise({
			redirectTo: "/CommonError"
		});
	}]); //config

	app.config(function (blockUIConfig) {
		// Tell blockUI not to mark the body element as the main block scope.
		blockUIConfig.autoInjectBodyBlock = false;  
	});

	app.run(function(editableOptions) {
		editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
	});

})(); //function
