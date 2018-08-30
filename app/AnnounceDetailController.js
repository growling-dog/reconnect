"use strict";
(function () {
var app = angular.module("ReConnectApp");
app.controller("AnnounceDetailController", ["$scope", "$http", "AnnounceService", "sharedService", "$location","$filter", "$timeout", "$routeParams", "Upload", "globalConfig",  function ($scope, $http, AnnounceService, sharedService, $location, $filter, $timeout, $routeParams, Upload, globalConfig) {

//##########################################################################################################################
//### Global Variables ###
//### Handle Accordion collapse and expand ###
	$scope.currentYear = globalConfig.appCalendarYear;
	$scope.listName = "Announcement";
	$scope.maxPhotoNumber = 10;
	$scope.master = {};

	$scope.CancelForm = function() {
		$location.path('/AnnounceMain');
	};
	
	$scope.HomeForm = function() 
	{
		$location.path('/');
	};

	
//##########################################################################################################################

//##########################################################################################################################
//### Databinding.  Fill the form from REST SP List ###
	AnnounceService.getByItemID($routeParams.itemID).then(function (response) {

		$scope.master = {
			ItemID: response.d.ID,
			Title : response.d.Title,
			Division : response.d.Division,
			Description : response.d.Description,
			ExpiryDate : response.d.ExpiryDate,
			CoverImage : response.d.Cover_x0020_Image,	
            Created : response.d.Created,
            Author : response.d.Author.Title,
            Status : response.d.Status,
			LikesCount : response.d.LikesCount,
			LikedBy : response.d.LikedBy,
			Reference_x0020_Link_x0020_1 : response.d.Reference_x0020_Link_x0020_1 == null ? '' : response.d.Reference_x0020_Link_x0020_1.Url,
			Reference_x0020_Link_x0020_2 : response.d.Reference_x0020_Link_x0020_2 == null ? '' : response.d.Reference_x0020_Link_x0020_2.Url,
			Reference_x0020_Link_x0020_3 : response.d.Reference_x0020_Link_x0020_3 == null ? '' : response.d.Reference_x0020_Link_x0020_3.Url,
			Reference_x0020_Link_x0020_4 : response.d.Reference_x0020_Link_x0020_4 == null ? '' : response.d.Reference_x0020_Link_x0020_4.Url,
			Reference_x0020_Link_x0020_5 : response.d.Reference_x0020_Link_x0020_5 == null ? '' : response.d.Reference_x0020_Link_x0020_5.Url,												
		};

		if ($scope.master.CoverImage == null) {
			$scope.master.coverImgUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-images4.jpg";
		} else {
			$scope.master.coverImgUrl = AnnounceService.getAttachment($scope.master.ItemID, $scope.master.CoverImage);
		}

		AnnounceService.getUploadedAttachmentList($scope.master.ItemID).then(function (response, status) {
			$scope.master.subFileName = response.d.results;
		});
	
		
		AnnounceService.getLikeUnlike ($scope.master.LikedBy).then(
			function(response,status) 
			{
				$scope.currentLikeStatus = response;
			}
		);
	});
//##########################################################################################################################
	$scope.likeOnClick = function (master) 
	{
		
		var bLike,likeUnlikeID,likeUnlikeIDVal,context,list,peopleSet,likecount;
		var itemID = master.ItemID;
		
		
		console.log("master...." + master.ItemID);
		console.log("appNewsListId..."+ $scope.listName);
		console.log("AnnounceListID ..."+globalConfig.appAnnounceListId);
		
		
		
		SP.SOD.registerSod('SP.js', '/_layouts/15/SP.js'); 
		SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
			SP.SOD.registerSod('reputation.js', '/_layouts/15/reputation.js');
			SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function(){							
				var aContextObject = new SP.ClientContext();							
				context = SP.ClientContext.get_current();			
				bLike = !$scope.currentLikeStatus;
				SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
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
						alert("Error found likepage (DetailController):" + args.get_message() );	
					});
				}); //SP.SOD.executeFunc...	
			});							
		});

	}

	/*$scope.checkLikeUnlike= function (people) 
	{
		var bLiked = false;
		
		console.log("CheckLikeUnlike Start");
		console.log("People:" + JSON.stringify(people));
		
		var sCurrentUser='';
		
		
		AnnounceService.getCurrentUser()
		.then(function (response) {
			var sResult = response;
									
			sCurrentUser=sResult.d.Title;
			if (typeof people.results!='undefined')
			{
			
				for (var i=0;i<people.results.length;i++)
				{
					var person = people.results[i];
					console.log("Person Title:" +person.Title +", sCurrentUser:"+ sCurrentUser);
					if (typeof person!='undefined')
					{
						if (sCurrentUser===person.Title)
						{
							console.log("Correct Link!!!");
							//bLiked = true;
							return true;
							break;	
						}
					}
				 }
			}
	 
		});
		 
		 return bLiked;
	
	}*/




    }]); //controller
})(); //function