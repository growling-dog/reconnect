"use strict";
(function () {
    var app = angular.module("ReConnectApp");
    
    /*	app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
	}]);*/

    app.filter("cleanUp", ['$sce', function($sce) {
  		return function(textToCleanUp){
    		return $sce.trustAsHtml(textToCleanUp);
  		}
	}]);
    
    app.controller("AnnounceMainController", ["$scope", "$http", "$q", "AnnounceService", "sharedService", "$location","$window", "$timeout", "globalConfig","ngDialog","blockUI","$filter",  function ($scope, $http, $q, AnnounceService, sharedService, $location, $window, $timeout, globalConfig,ngDialog,blockUI,$filter) {
		            
//##########################################################################################################################
//### Global Variables ###

    $scope.currentPage = 1;
    $scope.pageSize = 12;
    $scope.currentYear = globalConfig.appCalendarYear;
    $scope.listName = "Announcement"; //globalConfig.appListName;;


	var mStartDate,mEndDate,mid;


    $scope.CustomValidator = {
        isLatestNews : false
    };
   $scope.Division=[];
  
   $scope.FormData = {
        FromDate:'',
        ToDate:'',
        Division:''
   };


  /*  $scope.Division= [
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

//##########################################################################################################################

//##########################################################################################################################
//### pageChangeHandler ###
    $scope.pageChangeHandler = function(num) {
        console.log('page changed to: ' + num);
    };
//##########################################################################################################################

//##########################################################################################################################
//### getAllAnnounceHeader ###
    
    
    
    
    AnnounceService.getAllNewsHeader().then(function (response) {
        $scope.master = response.d.results;
        $scope.total = response.d.results.length;
	
        var today = new Date();
        var numberOfDaysToAdd = 7;
        var new_date = moment(today, "DD-MM-YYYY").add(numberOfDaysToAdd, 'days');
        var sText;
	    
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
    });
    
 
   
    
    

//##########################################################################################################################
//### loopImage ###
    $scope.loopImage = function(ID, image) {
		var baseUrl = _spPageContextInfo.webAbsoluteUrl;
        var checkUrl = '';
        if (image == null) {
            checkUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-images3.jpg";
        } else {
		    checkUrl = baseUrl+"/Lists/"+ $scope.listName +"/Attachments/"+ID+"/"+image+"";
        }
		return checkUrl;
	};
//##########################################################################################################################





	$scope.onStartDateSet = function (startDate) {
    		mStartDate = startDate;
     	
  	}
  	
  	
  	$scope.onEndDateSet = function (endDate) {
    	//console.log(newDate + '--' + oldDate);
     	mEndDate = endDate;
     	
   
  	}
 

	//##########################################################################################################################
	//### Get Division Name by searching Division Code
	
	//getDivisionNameByCode 
	
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
	//###

	$scope.likeOnClick= function (master) 
	{
		
		var bLike,likeUnlikeID,likeUnlikeIDVal,context,list,peopleSet,likecount;
		var itemID = master.ID;
		var aContextObject;
		
		console.log("master (itemID)...." + master.ID);
		console.log("appNewsListId..."+ $scope.listName);
		console.log("AnnounceListID ..."+globalConfig.appAnnounceListId);
		console.log("JSON:" + JSON.stringify(master));
		
		
		
		
		SP.SOD.registerSod('SP.js', '/_layouts/15/SP.js'); 
		
		
		SP.SOD.registerSod('reputation.js', '/_layouts/15/reputation.js');
    	SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
   			SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function(){
   				aContextObject = new SP.ClientContext();		
   				context = SP.ClientContext.get_current();
   				bLike = !$scope.currentLikeStatus;
   				
   				console.log("aContextObject:" + aContextObject + ",context:" + context + ",bLike:" + bLike );
   				
				Microsoft.Office.Server.ReputationModel.Reputation.setLike(aContextObject, globalConfig.appAnnounceListId, itemID , bLike);
					aContextObject.executeQueryAsync(function () {
						if (bLike) {
							master["LikesCount"] =  master.LikesCount+1;
						} else {
							master["LikesCount"] =  master.LikesCount-1;
						}
						$scope.currentLikeStatus = bLike;
						document.getElementById("divLikeCount").innerHTML = master.LikesCount;
						$scope.$apply();
					}, function (sender, args) {
						alert("Error found likepage:" + args.get_message() );	
						console.log(args.get_message());
					});

   			});
				
		});
	}

	function checkLikeUnlike(people)
	{
		var bLikeSelected = false;
		
		var sCurrentUser='';
		
		AnnounceService.getCurrentUser()
		.then(function (response) {
			var sResult = response;
			console.log("people ... "+ JSON.stringify(sResult));
			
			sCurrentUser=sResult.d.Title;
			
			//
			for (var i=0;i<people.length;i++)
			{
				var person = people[i];
				var personid = people[i].ID;
				var bLiked = false;
				
				if (typeof person.LikedBy.results!='undefined')
				{
					//console.log(person.LikedBy.results[0].Title);
					for (var j=0;j<person.LikedBy.results.length;j++)
					{
						if (sCurrentUser===person.LikedBy.results[j].Title)
						{
							bLiked = true;
							break;
						}
						
					}
				}
				console.log("i:"+i+",sCurrentUser:" + sCurrentUser + ",bLiked:" + bLiked);
				
				if (bLiked)
				{
					//document.getElementById("divLikeUnlike-Liked-"+personid).innerHTML="Unlike";
					bLikeSelected = true;
	
				}
				else
				{
					//document.getElementById("divLikeUnlike-Liked-"+personid).innerHTML="Like";
					bLikeSelected = false;

				}
				
				return bLikeSelected;
				
			 }
		});
	}

	//##########################################################################################################################
	//### clickToSearch dialog ###
	    $scope.clickToSearch = function() {
	        ngDialog.openConfirm({
	            template: '../SiteAssets/reconnect/templates/AnnounceSelectDate.tpl.html',
	            controller : 'AnnounceSearchDialogController',
	            scope: $scope
	        }).then(function(value){
	        	
	        
	            $scope.FormData.FromDate = ($scope.FormData.FromDate == null ? '' : $filter('date')(new Date($scope.FormData.FromDate),'yyyy-MM-dd'));
	            $scope.FormData.ToDate = ($scope.FormData.ToDate == null ? '' : $filter('date')(new Date($scope.FormData.ToDate),'yyyy-MM-dd'));     
	            $scope.FormData.Division.id = ($scope.FormData.Division == null ? '' : $scope.FormData.Division.id);  
	            $scope.FormData.Division.text = ($scope.FormData.Division == null ? '' : $scope.FormData.Division.text);  

	            AnnounceService.getHeaderAnnouncementRange ($scope.FormData.Division.id,$scope.FormData.FromDate, $scope.FormData.ToDate).then(function (response) {
	                blockUI.start("Loading......");
	                $timeout( function()
	                {
	                    blockUI.stop();
	                    $scope.master = response.d.results;
	                    $scope.total = response.d.results.length;
	                }, 1000);
	            });
	             console.log($scope.FormData.FromDate, $scope.FormData.ToDate); 
	        },function(reject){
	            console.log("reject: "+reject);
	        });
	    };
	    
	    
	//##########################################################################################################################


    }]); //controller
    
 //##########################################################################################################################
//### Another Controller to handle ngDialog events. ###
app.controller('AnnounceSearchDialogController', function($scope, ngDialog, $http, AnnounceService) {
    var divisionIndex = -1;
    var display = '';
    $scope.Division=[];
    AnnounceService.getDivisionList().then(function (response) {
        for (var i=0;i<response.d.results.length;i++)
        {
            display = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
            $scope.Division.push(display);
        } 
    }).then( function(){
        angular.forEach($scope.Division, function(value, key){
        
        	      	

            if(value.id == $scope.FormData.Division.id) {
                divisionIndex =  key;
            }
        });
        $scope.FormData.Division = $scope.Division[divisionIndex]; 
    });
});
//##########################################################################################################################

    
})(); //function