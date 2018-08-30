"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    
    app.filter('htmlToPlaintext', function() {
    return function(text) {
      return angular.element(text).text();
    }
  });
    
    
    app.controller("homeController", ["$scope", "$http", "$q", "newsService", "AnnounceService","sharedService", "$location","blockUI", "$timeout", "globalConfig", function ($scope, $http, $q, newsService, AnnounceService, sharedService, $location, blockUI, $timeout, globalConfig) {

        angular.element(document).ready(function () {
			
			$scope.announcemaster=[];
			$scope.announcetotal=0;
			$scope.Division=[];

			
            $scope.currentYear = globalConfig.appCalendarYear;
            $scope.listName = globalConfig.appListName;
            $scope.myInterval = 6000;
            $scope.noWrapSlides = false;
            $scope.active = 0;

            newsService.getFilteredNewsHeader().then(function (response) {
                blockUI.start("Loading......");
                $timeout( function()
                {
                    blockUI.stop();
                    $scope.master = response.d.results;
                    $scope.total = $scope.master.length;
                }, 1000);
            });
            
	        AnnounceService.getDivisionList().then
		    (
		    	function (response) 
		    	{
	    	  		for (var i=0;i<response.d.results.length;i++)
		    		{
	    				//sText = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
		    			$scope.Division.push({id: response.d.results[i].DivCode, text: response.d.results[i].Title});
	    			}
	    			
	    		
		    	}
		    );

            
            
            
             AnnounceService.getAllNewsHeader().then(function (response) {
                blockUI.start("Loading......");
                $timeout( function()
                {
                    blockUI.stop();
                    $scope.announcemaster = response.d.results;
                }, 1000);
            });
           

            $scope.formatImgUrl = function(itemId, image) {
                var baseUrl = _spPageContextInfo.webAbsoluteUrl;
                var checkUrl = baseUrl+"/Lists/"+ $scope.listName +"/Attachments/"+itemId+"/"+image+"";
                return checkUrl;
            };
			
			 $scope.getDivisionNameByCode = function(divID) 
			 {
			 	var rtnStr='';
		
			 	//$scope.Division
			 	
		    	for (var i=0;i<$scope.Division.length;i++)
				{
					//sText = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
					//$scope.Division.push(sText);
					
					if ($scope.Division[i].id === divID)
					{
						//console.log ("Found! -- "+ $scope.Division[i].text);
						rtnStr = $scope.Division[i].text;
						break; 
					}
					
				}
				return rtnStr;
			 	
			 }

        });

    }]); //controller
})(); //function