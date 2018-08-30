"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    app.controller("NewsMainController", ["$scope", "$http", "newsService", "sharedService", "$location","$filter", "$timeout", "globalConfig", "blockUI", "ngDialog", function ($scope, $http, newsService, sharedService, $location, $filter, $timeout, globalConfig, blockUI, ngDialog) {

//##########################################################################################################################
//### Global Variables ###
    $scope.currentPage = 1;
    $scope.pageSize = 12;
    $scope.currentYear = globalConfig.appCalendarYear;
    $scope.listName = globalConfig.appListName;
    var thisYear = new Date().getFullYear();
    var thisMonth = new Date().getMonth();
    var thisDate = new Date().getDate();
    $scope.FormData = {
        FromDate:'',
        ToDate:'',
        Division:''
    };
    $scope.CustomValidator = {
        isLatestNews : false
    };
//##########################################################################################################################


//##########################################################################################################################
//### pageChangeHandler ###
    $scope.pageChangeHandler = function(num) {
        console.log('page changed to: ' + num);
    };
//##########################################################################################################################


//##########################################################################################################################
//### getAllNewsHeader ###
    newsService.getAllNewsHeader().then(function (response) {
        blockUI.start("Loading......");
        $timeout( function()
        {
            blockUI.stop();
            $scope.master = response.d.results;
            $scope.total = response.d.results.length;
        }, 1000);
    });
//##########################################################################################################################


//##########################################################################################################################
//### loopImage ###
    $scope.loopImage = function(ID, image) {
		var baseUrl = _spPageContextInfo.webAbsoluteUrl;
        var checkUrl = '';
        if (image == null) {
            checkUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-image.jpg";
        } else {
		    checkUrl = baseUrl+"/Lists/"+ $scope.listName +"/Attachments/"+ID+"/"+image+"";
        }
		return checkUrl;
	};
//##########################################################################################################################


//##########################################################################################################################
//### clickToSearch dialog ###
    $scope.clickToSearch = function() {
        ngDialog.openConfirm({
            template: '../SiteAssets/reconnect/templates/NewsSelectDate.tpl.html',
            controller : 'NewsSearchDialogController',
            scope: $scope
        }).then(function(value){

            $scope.FormData.FromDate = ($scope.FormData.FromDate == null ? '' : $filter('date')(new Date($scope.FormData.FromDate),'yyyy-MM-dd'));
            $scope.FormData.ToDate = ($scope.FormData.ToDate == null ? '' : $filter('date')(new Date($scope.FormData.ToDate),'yyyy-MM-dd'));     
            $scope.FormData.Division = ($scope.FormData.Division == null ? '' : $scope.FormData.Division.id);                
                      
            if($scope.FormData.FromDate == '' || $scope.FormData.FromDate == 'Invalid Date') {
                $scope.FormData.FromDate = thisYear+'-01'+'-01';
            }
            if($scope.FormData.ToDate == '' || $scope.FormData.ToDate == 'Invalid Date') {
                $scope.FormData.ToDate = thisYear+'-12'+'-31';
            }

            
           // console.log( $scope.FormData.FromDate,  $scope.FormData.ToDate);
            newsService.getFilteredDateRangeNewsHeader($scope.FormData.FromDate, $scope.FormData.ToDate, $scope.FormData.Division).then(function (response) {
                blockUI.start("Loading......");
                $timeout( function()
                {
                    blockUI.stop();
                    $scope.master = response.d.results;
                    $scope.total = response.d.results.length;
                }, 1000);
            });
        },function(reject){
            console.log("reject: "+reject);
        });
    };
//##########################################################################################################################

}]); //controller

//##########################################################################################################################
//### Another Controller to handle ngDialog events. ###
app.controller('NewsSearchDialogController', function($scope, ngDialog, $http, newsService) {
    var divisionIndex = -1;
    var display = '';
    $scope.Division=[];
    newsService.getDivisionList().then(function (response) {
        for (var i=0;i<response.d.results.length;i++)
        {
            display = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
            $scope.Division.push(display);
        } 
    }).then( function(){
        angular.forEach($scope.Division, function(value, key){
            if(value.id == $scope.FormData.Division) {
                divisionIndex =  key;
            }
        });
        $scope.FormData.Division = $scope.Division[divisionIndex]; 
    });
});
//##########################################################################################################################


})(); //function