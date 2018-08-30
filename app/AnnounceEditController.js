"use strict";
(function () {
var app = angular.module("ReConnectApp");
app.controller("AnnounceEditController", ["$scope", "$http", "AnnounceService", "sharedService", "$location","$filter", "$timeout", "$routeParams", "Upload", "globalConfig",  function ($scope, $http, AnnounceService, sharedService, $location, $filter, $timeout, $routeParams, Upload, globalConfig) {

//##########################################################################################################################
//### Global Variables ###
//### Handle Accordion collapse and expand ###
	$scope.currentYear = globalConfig.appCalendarYear;
	$scope.listName = "Announcement"; //globalConfig.appListName;
	$scope.maxPhotoNumber = 10;
	$scope.master = {};
	var sText;

	$scope.panelStatus = {
		isCustomHeaderOpen: false
	};
/*	$scope.panelCalendarStatus = {
		//isCalendarHeaderOpen: true
		isCalendarHeaderOpen: false

	};*/
	$scope.panelThumbnail = {
		isThumbnailHeaderOpen: true
	};	
	
	$scope.my = {
		isDuplicatedFileName: false,
		isMaxNumber:false
	};

	$scope.CancelForm = function() {
		$location.path('/AnnounceMain');
	};
	$scope.Division=[];
//##########################################################################################################################

//##########################################################################################################################
//### Databinding.  Fill the form from REST SP List ###
	AnnounceService.getByItemID($routeParams.itemID).then(function (response) {
	
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
		
			
		$scope.master = {
			ItemID: response.d.ID,
			Title : response.d.Title,
			Division : response.d.Division,
			Description : response.d.Description,
			ExpiryDate : response.d.ExpiryDate,
			CoverImage : (response.d.Cover_x0020_Image == null ? '' : response.d.Cover_x0020_Image),		
			Reference_x0020_Link_x0020_1 : response.d.Reference_x0020_Link_x0020_1 == null ? '' : response.d.Reference_x0020_Link_x0020_1.Url,
			Reference_x0020_Link_x0020_2 : response.d.Reference_x0020_Link_x0020_2 == null ? '' : response.d.Reference_x0020_Link_x0020_2.Url,
			Reference_x0020_Link_x0020_3 : response.d.Reference_x0020_Link_x0020_3 == null ? '' : response.d.Reference_x0020_Link_x0020_3.Url,
			Reference_x0020_Link_x0020_4 : response.d.Reference_x0020_Link_x0020_4 == null ? '' : response.d.Reference_x0020_Link_x0020_4.Url,
			Reference_x0020_Link_x0020_5 : response.d.Reference_x0020_Link_x0020_5 == null ? '' : response.d.Reference_x0020_Link_x0020_5.Url,	
			LikesCount : response.d.LikesCount,
			LikedBy : response.d.LikedBy
											
		};
		
		if ($scope.master.CoverImage == '') {
			$scope.master.coverImgUrl = "https://shangrila.sharepoint.com/sites/reconnect/SiteAssets/reconnect/images/no-images4.jpg";
		} else {
			$scope.master.coverImgUrl = AnnounceService.getAttachment($scope.master.ItemID, $scope.master.CoverImage);
		}

		AnnounceService.getUploadedAttachmentList($scope.master.ItemID).then(function (response, status) {
			$scope.master.subFileName = response.d.results;
		});

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
		
		console.log("AnnounceEditController.UploadCoverImage getUploadedAttachmentList ...START"); 
		
		AnnounceService.getUploadedAttachmentList(itemId).then(function (response, status) {
			var results = response.d.results;
			//console.log(results.length);
			if (results) {
				if(results.length > 0) {
					results.some(function (value, index, _ary) {
						AnnounceService.deleteDocument(itemId, value.FileName).then(function (response, status) {
							console.log("Existing Attachment is clear.");
						}); //AnnounceService.deleteDocument
					});	//results.some
				}
			} // results
		}); //AnnounceService.getUploadedAttachmentList

		$timeout(function () {
			console.log("Timeout for 1 sec...");
		}, 1000);


console.log("AnnounceEditController.UploadCoverImage getUploadedAttachmentList ...END"); 
console.log("AnnounceEditController.uploadDocument ...START"); 
		AnnounceService.uploadDocument(itemId, file).then(function (response, status) {
			file.result = true;
			uploadedFileName = response.d.FileName;
			if(uploadedFileName !== "") {
				AnnounceService.updateCoverImageName(itemId, response.d.FileName).then(function (response, status) {
					$scope.master.coverImgUrl = AnnounceService.getAttachment($scope.master.ItemID, uploadedFileName);
					console.log("Updated Cover Img.");
				});
			}
		}); //AnnounceService.uploadDocument
console.log("AnnounceEditController.uploadDocument ...END") 

	};
	
$scope.filesChanged = function(input) 
{

	var myFiles = input.files;
	var myFile,fileAddress,filedata;
	var itemId = $scope.master.ItemID;


	for( var i = 0; i < myFiles.length; i++) {
	 (function(index){
	   setTimeout(function(){
			
			console.log("Index:"+index+", i:" + i + ", File:"+ myFiles[index].name+"....Data Update Start");	
			console.log("Index:"+index+", i:" + i + ", File:"+ myFiles[index].name+"....Data Update End");	
			$scope.uploadMultiImage(myFiles[index]);

  	
	   }, i * 1000);
	
	 })(i);
	}

	

};

	
	
//##########################################################################################################################

//##########################################################################################################################
//### Update the form with JS validation ###
  $scope.updateNews = function(master) {
	  	var itemId = $scope.master.ItemID;
		console.log(master.ExpiryDate);
		AnnounceService.updateNews(master,itemId).then(function (response, status) {
			console.log("Update Successfully.");
		});
  };
  $scope.validateTitle = function(data) {
	if (data !== '' && data.length > 255) {		
    	return "The length of Title is too long.  Max 255 characters.";
    }
  };
  $scope.validateDescription = function(data) {
	if (data !== '' && data.length > 10000) {		
    	return "The length of Description is too long.  Max 10,000 characters.";
    }
  };
  $scope.validateUrl = function(data) {
	if (data !== '' && data.length > 255) {		
    	return "The length of Description is too long.  Max 255 characters.";
    }
  };
//##########################################################################################################################

//##########################################################################################################################
//### Upload SUB images with validation ###
	$scope.uploadMultiImage = function(file) {
		var itemId = $scope.master.ItemID;
		var isNewFile = true;
		var isMaxNumber = false;
		var uploadedFileName = "";

		AnnounceService.getUploadedAttachmentList(itemId).then(function (response, status) {
			var results = response.d.results;
			if (results) {
				//if(results.length > 0 && results.length < $scope.maxPhotoNumber) {
				if(results.length >= 0 && results.length < $scope.maxPhotoNumber) {
					results.some(function (value, index, _ary) {						
						if (value.FileName == file.name) {
							console.log("FileName is duplicated");
							isNewFile = false;
							$scope.my.isDuplicatedFileName = true;						
							return false;
						}
					});
				} else {
				
					console.log("GetUploadAttachment Error: results.length:"+  results.length);
				
					isMaxNumber = true;
					$scope.my.isMaxNumber = true;	
				}
			}
		}).then( function(){
			if (!isMaxNumber && isNewFile) {
				AnnounceService.uploadDocument(itemId, file).then(function (response, status) {					
					uploadedFileName = response.d.FileName;
					file.result = true;
					console.log("Upload compvared FileName: "+uploadedFileName, response.d);	
				}).then( function(){
					AnnounceService.getUploadedAttachmentList(itemId).then(function (response, status) {

						$scope.master.subFileName = response.d.results;
						console.log("$scope.master.subFileName: " + $scope.master.subFileName);
						console.log(""+ $scope.master.subFileName.FileName);

					});
				});
			}
		});	
	};	
//##########################################################################################################################

//##########################################################################################################################
//### Remove Sub Images ###

$scope.deleteDocument = function(item,fileName) {
	var itemId = $scope.master.ItemID;
	var index =  $scope.master.subFileName.indexOf(item);
	alert('delete document item'+ item + 'index:' + index);
		
	
	AnnounceService.deleteDocument(itemId, fileName)
	.then(function (response) {
		$scope.master.subFileName.splice(index ,1);
		$scope.showSuccessAlert = true;
	});
};

//### Remove Announcement ###

$scope.RemoveNews = function(master){		
	AnnounceService.deleteNews(master.ItemID)
	.then(function (response) {
		alert('Your announcement was removed.');
		$location.path('/AnnounceMain/');
	});
}; 


/*
$scope.RemoveSubImage = function(fileName, thisIndex) {
	var itemId = $scope.master.ItemID;
	AnnounceService.deleteDocument(itemId, fileName)
	.then(function (response) {
		$scope.master.subFileName.splice(thisIndex,1);
		$scope.showSuccessAlert = true;
	});
};*/
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

})(); //function