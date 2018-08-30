"use strict";
(function () {
var app = angular.module("ReConnectApp");
app.controller("NewsDetailController", ["$scope", "$http", "newsService", "sharedService", "$location","$filter", "$timeout", "$routeParams", "Upload", "globalConfig", "blockUI",  function ($scope, $http, newsService, sharedService, $location, $filter, $timeout, $routeParams, Upload, globalConfig, blockUI) {

//##########################################################################################################################
//### Global Variables & INIT function callback###
//### Handle Accordion collapse and expand ###
	angular.element(document).ready(function () {
		$scope.currentYear = globalConfig.appCalendarYear;
		$scope.listName = globalConfig.appListName;
		$scope.appNewsListId = globalConfig.appNewsListId;

		$scope.maxPhotoNumber = 10;
		$scope.master = {};
		$scope.currentLikeStatus = true;

		$scope.customValidator = {
			isExpiredNews:false
		};

		$scope.my = {
			createdOK : sharedService.getShared("AddAction"),
			createdSuccessAlert : "News header created successfully.  You can continue to upload cover image.",
			updatedOK : sharedService.getShared("UpdateAction"),
			updatedSuccessAlert : "News updated successfully."		
		};

		$scope.CancelForm = function() {
			$location.path('/NewsMain');
		};

		$scope.HomeForm = function() {
			$location.path('/');
		};

		$scope.EditForm = function(ItemID) {
			$location.path('/NewsEdit/'+ItemID+'/');
		};

 		blockUI.start("Loading......");	 
		newsService.getByItemID($routeParams.itemID).then(function (response) {
			$timeout( function()
			{
				blockUI.stop();			
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
					Reference_x0020_Link_x0020_5 : response.d.Reference_x0020_Link_x0020_5 == null ? '' : response.d.Reference_x0020_Link_x0020_5.Url										
				};

				if ($scope.master.CoverImage == null) {
					$scope.master.coverImgUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-images4.jpg";
				} else {
					$scope.master.coverImgUrl = newsService.getAttachment($scope.master.ItemID, $scope.master.CoverImage);
				}

				newsService.getUploadedAttachmentList($scope.master.ItemID).then(function (response, status) {
					$scope.master.subFileName = response.d.results;
				});

				$scope.checkLikeUnlike($scope.master);
					
				newsService.getDivisionNameByCode($scope.master.Division).then(function (response) {
					$scope.master.DivisionName = response.d.results[0].Title; 
				});
			 }, 1000);
		});
		sharedService.removeShared();
	});
//##########################################################################################################################


//##########################################################################################################################
//### checkLikeUnlike ###
	$scope.checkLikeUnlike = function(master) {
		var sCurrentUser = "";
		var sResult = "";
		var bLiked = false;
		var itemID = master.ItemID;
		newsService.getCurrentUser().then(function (response) {
			sResult = response;
			sCurrentUser = sResult.d.Title;
			if (typeof master.LikedBy.results!='undefined')
			{
				for (var j=0; j<master.LikedBy.results.length; j++)
				{
					if (sCurrentUser === master.LikedBy.results[j].Title)
					{
						bLiked = true;
						break;
					}
				}
			}
			$scope.currentLikeStatus = bLiked;	
		});
	};
//##########################################################################################################################


//##########################################################################################################################
//### likeOnClick ###
	$scope.likeOnClick = function (master) 
	{
		var bLike,likeUnlikeID,likeUnlikeIDVal,context,list,peopleSet,likecount;
		var itemID = master.ItemID;
		SP.SOD.registerSod('SP.js', '/_layouts/15/SP.js'); 
		SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
			SP.SOD.registerSod('reputation.js', '/_layouts/15/reputation.js');
			SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function(){							
				var aContextObject = new SP.ClientContext();							
				context = SP.ClientContext.get_current();			
				bLike = !$scope.currentLikeStatus;
				SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
					Microsoft.Office.Server.ReputationModel.Reputation.setLike(aContextObject, $scope.appNewsListId, itemID , bLike);
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
					});
				}); //SP.SOD.executeFunc...	
			});							
		});
	}
//##########################################################################################################################
}]); //controller


//##########################################################################################################################
//### Custom AngularJS: return as trusted HTML output.
app.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});

})(); //function