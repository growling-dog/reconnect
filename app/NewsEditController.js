"use strict";
(function () {
var app = angular.module("ReConnectApp");
app.controller("NewsEditController", ["$scope", "$http", "newsService", "sharedService", "$location","$filter", "$timeout", "$routeParams", "Upload", "globalConfig", "blockUI",  function ($scope, $http, newsService, sharedService, $location, $filter, $timeout, $routeParams, Upload, globalConfig, blockUI) {

//##########################################################################################################################
//### Global Variables ###
//### Handle Accordion collapse and expand ###
	$scope.currentYear = globalConfig.appCalendarYear;
	$scope.listName = globalConfig.appListName;
	$scope.maxPhotoNumber = 10;
	$scope.master = {};

	$scope.panelStatus = {
		isCustomHeaderOpen: false
	};

	$scope.panelCalendarStatus = {
		isCalendarHeaderOpen: true
	};

	$scope.panelThumbnail = {
		isThumbnailHeaderOpen: true
	};	

	$scope.panelRemove = {
		isRemoveHeaderOpen: true
	};		

	$scope.my = {
		isDuplicatedFileName: false,
		isMaxNumber:false,
		showRemovedAlert:false,
		isValidDate : true,
		createdOK : sharedService.getShared("AddAction"),
		createdSuccessAlert : "News header created successfully.  You can continue to upload cover image.",
		updatedOK : sharedService.getShared("UpdateAction"),
		updatedSuccessAlert : "News updated successfully.",
		thisUpdatedOK : false,
		thisUpdatedSuccessAlert : "News updated successfully."		
	};

	$scope.CancelForm = function() {
		$location.path('/NewsMain');
	};

	$scope.$on("$destroy", function() {
		sharedService.removeShared();
	});	

//##########################################################################################################################


//##########################################################################################################################
//### Databinding.  Fill the form from REST SP List ###
	blockUI.start("Loading......");	 
	newsService.getByItemID($routeParams.itemID).then(function (response) {
		$timeout( function(){
			var divisionIndex = -1;
			var display = '';
			$scope.Division=[];
			newsService.getDivisionList().then(function (response) {
				for (var i=0;i<response.d.results.length;i++)
				{
					display = {id: response.d.results[i].DivCode, text: response.d.results[i].Title};
					$scope.Division.push(display);
				} 
			});

			$scope.master = {
				ItemID: response.d.ID,
				Title : response.d.Title,
				Division : response.d.Division,
				Description : response.d.Description,
				ExpiryDate : response.d.ExpiryDate,
				Status : response.d.Status,
				CoverImage : (response.d.Cover_x0020_Image == null ? '' : response.d.Cover_x0020_Image),		
				Reference_x0020_Link_x0020_1 : response.d.Reference_x0020_Link_x0020_1 == null ? '' : response.d.Reference_x0020_Link_x0020_1.Url,
				Reference_x0020_Link_x0020_2 : response.d.Reference_x0020_Link_x0020_2 == null ? '' : response.d.Reference_x0020_Link_x0020_2.Url,
				Reference_x0020_Link_x0020_3 : response.d.Reference_x0020_Link_x0020_3 == null ? '' : response.d.Reference_x0020_Link_x0020_3.Url,
				Reference_x0020_Link_x0020_4 : response.d.Reference_x0020_Link_x0020_4 == null ? '' : response.d.Reference_x0020_Link_x0020_4.Url,
				Reference_x0020_Link_x0020_5 : response.d.Reference_x0020_Link_x0020_5 == null ? '' : response.d.Reference_x0020_Link_x0020_5.Url,
			};

			if ($scope.master.CoverImage == '') {
				$scope.master.coverImgUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-images4.jpg";
			} else {
				$scope.master.coverImgUrl = newsService.getAttachment($scope.master.ItemID, $scope.master.CoverImage);
			}

			newsService.getUploadedAttachmentList($scope.master.ItemID).then(function (response, status) {
				$scope.master.subFileName = response.d.results;
			});
			blockUI.stop();
		 }, 1000);
		
	});
//##########################################################################################################################


//##########################################################################################################################
//### xeditable form ###
	$scope.opened = {};
	$scope.open = function($event, elementOpened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened[elementOpened] = !$scope.opened[elementOpened];
	};
//##########################################################################################################################


//##########################################################################################################################
//### Upload COVER image with check item duplication ###
	$scope.uploadCoverImage = function(file) {
		var itemId = $scope.master.ItemID;
		var uploadedFileName = "";
		var existingCoverImg = $scope.master.CoverImage;
		var results = "";

		newsService.getUploadedAttachmentList(itemId).then(function (response, status) {
			results = response.d.results;
		}).then( function(){
			$timeout(function () {
				if (results) {
					if(results.length > 0) {
						results.some(function (value, index, _ary) {
							if (existingCoverImg == value.FileName) {
								newsService.deleteDocument(itemId, value.FileName).then(function (response, status) {
									console.log("Existing Attachment is clear. FileName "+value.FileName);
									console.log("FileName "+value.FileName);
								});
								return false;
							}
						});	
					}
				}
			}, 300);
		}).then( function(){
			$timeout(function () {
				newsService.uploadDocument(itemId, file).then(function (response, status) {
					file.result = true;
					uploadedFileName = response.d.FileName;
					if(uploadedFileName !== "") {
						newsService.updateCoverImageName(itemId, response.d.FileName).then(function (response, status) {
							$scope.master.coverImgUrl = newsService.getAttachment($scope.master.ItemID, uploadedFileName);
							console.log("Updated Cover Img.");
							$location.path('/NewsDetail/'+ itemId);
						});
					}
				});
			}, 300);
		});
	};
//##########################################################################################################################


//##########################################################################################################################
//### Update the form with JS validation ###
  $scope.updateNews = function(master) {
	  	var itemId = $scope.master.ItemID;
		newsService.updateNews(master,itemId).then(function (response, status) {
			$scope.my.thisUpdatedOK = true;
			//console.log($scope.my.thisUpdatedOK);
		});
  };
  $scope.validateTitle = function(data) {
	if (data !== '' && data.length > 255) {		
    	return "The length of Title is too long.  Max 255 characters.";
    }
  };
  $scope.validateDescription = function(data) {
	if (data !== '' && data.length > 5000) {		
    	return "The length of Description is too long.  Please shorten the description.";
    }
  };
  $scope.validateUrl = function(data) {
	if (data !== '' && data.length > 255) {		
    	return "The length of Description is too long.  Max 255 characters.";
    }
  };
  $scope.validateExpiryDate = function(data) {
	var today = new Date();
	var todayFormatted = $filter('date')(today,'yyyy-MM-dd');
	var thisExpiryDate = $filter('date')(data,'yyyy-MM-dd');
	$scope.my.isValidDate = sharedService.validateDateObjects(todayFormatted,thisExpiryDate);	  
	if(!$scope.my.isValidDate) {
		return "Expiry Date cannot less than today.";
	}
  };
//##########################################################################################################################


//##########################################################################################################################
//### Upload Sub images with validation ###
	$scope.uploadMultiImage = function(file) {
		var itemId = $scope.master.ItemID;
		var isNewFile = true;
		var isMaxNumber = false;
		var uploadedFileName = "";

		newsService.getUploadedAttachmentList(itemId).then(function (response, status) {
			var results = response.d.results;
			if (results) {
				if(results.length > 0 && results.length < $scope.maxPhotoNumber) {
					results.some(function (value, index, _ary) {						
						if (value.FileName == file.name) {
							console.log("FileName is duplicated");
							isNewFile = false;
							$scope.my.isDuplicatedFileName = true;						
							return false;
						}
					});
				} else {
					isMaxNumber = true;
					$scope.my.isMaxNumber = true;	
				}
			}
		}).then( function(){
			if (!isMaxNumber && isNewFile) {
				newsService.uploadDocument(itemId, file).then(function (response, status) {
					uploadedFileName = response.d.FileName;
					file.result = true;	
				}).then( function(){
					newsService.getUploadedAttachmentList(itemId).then(function (response, status) {
						$scope.master.subFileName = response.d.results;					
					});
				});
			}
		});	
	};	
//##########################################################################################################################


//##########################################################################################################################
//### Remove Sub Images ###
	$scope.RemoveSubImage = function(fileName, thisIndex) {
		var itemId = $scope.master.ItemID;
		newsService.deleteDocument(itemId, fileName)
		.then(function (response) {
			$scope.master.subFileName.splice(thisIndex,1);
			$scope.showSuccessAlert = true;
		});
	};
//##########################################################################################################################


//##########################################################################################################################
//### Remove news ###
	$scope.RemoveNews = function(master){		
		newsService.deleteNews(master.ItemID)
		.then(function (response) {
			alert('Your news was removed.');
			$location.path('/NewsMain/');
		});
	}; 
//##########################################################################################################################

}]); //controller

//##########################################################################################################################
//### Custom AngularJS: to remove the cover image from object array ###
	app.filter('customFilter', function() {
	return function(items, imgName) {
			angular.forEach(items, function(value, key) {
				if (value.FileName == imgName) {
					items.splice(key,1);
					return items;
				}
			});
			return items;
		};
	});
//##########################################################################################################################

//##########################################################################################################################
//### Custom AngularJS: to remove the unnesscessary html code ###
//### SharePoint bug:   http://stackoverflow.com/questions/9163023/jquery-remove-divs-based-on-class-name
	app.filter('htmlBindFilter', function() {
	return function(items) {
			
			//console.log(items.limitTo(3,7));

			return items;
		};
	});
//##########################################################################################################################


//##########################################################################################################################
//### Custom Directives to handle confirm click event
	app.directive('ngConfirmClick', [function(){
		return {
			priority: -1,
			restrict: 'A',
			link: function(scope, element, attrs){
				element.bind('click', function(e){
				var message = attrs.ngConfirmClick;
				if(message && !confirm(message)){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				});
			}
		}
	}]);
//##########################################################################################################################

})(); //function