"use strict";
(function () {
	var app = angular.module("ReConnectApp");
	app.factory("AnnounceService", ["baseSvc", "sharedService", "globalConfig","$q", function(baseService, sharedService, globalConfig,$q) {
	//app.factory("AnnounceService", ["baseSvcTest", "sharedService", "globalConfig", function(baseService, sharedService, globalConfig) {

		var listEndPoint = '/_api/web/lists';
		var listName = "Announcement";//globalConfig.appListName;
		
		
		
		var getHeaderAnnouncementRange = function(divisionName,fromDate,toDate) 
		{
			var fDate = new Date(fromDate);
			var tDate = new Date(toDate);
			var today = new Date();		
			
			console.log("tDate before:"+tDate);
			tDate = new Date(new Date(tDate).getTime()+60*60*24*1000); //End Date - Date+23:59:56
			console.log("tDate after:"+tDate);
	
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$";
				query += "select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
				query += "&$filter=(Created ge datetime'"+fDate.toISOString()+"'";
				query += "and Created le datetime'"+tDate.toISOString()+"')";	
				query += "and (ExpiryDate ge datetime'"+today.toISOString()+"')";	
				if (divisionName!='')
				{
					query += "and (Division eq '"+divisionName+"')";
				}
				query += "and (Status eq 1)";
			console.log("getHeaderAnnouncementRange announcement:" + query);
			return baseService.getRequest(query);
		}


		/*** Select ALL records ************************************/
		var getAllNewsHeader = function() {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$";
			//query += "select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
			query += "select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount,LikedBy/Title&$expand=Author/Title,Editor/Title,LikedBy";
			query += "&$filter=(ExpiryDate ge datetime'"+today.toISOString()+"')";		
			query += "and (Status eq 1)";		
			console.log("getAllNewsHeader : "+query);
			

			return baseService.getRequest(query);
		};

		/*** Select TOP 10 records where cover image is NOT null ************************************/
		var getFilteredNewsHeader = function () {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$top=10&$"; 
				//query += "select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
				query += "select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount,LikedBy/Title&$expand=Author/Title,Editor/Title,LikedBy";
				query += "&$filter=(ExpiryDate ge datetime'"+today.toISOString()+"')";	
				query += "and (Cover_x0020_Image ne null)";	
				query += "and (Status eq 1)";		
			console.log("getFilteredNewsHeader : "+query);
			return baseService.getRequest(query);
		};


		var createNews = function(master) {
		
			console.log("AnnounceService Create News start");
		
			var data = {
				__metadata: { 'type': 'SP.Data.AnnouncementListItem' }, //SP.Data.CorporateNewsListItem should be changed
				Division: master.Division.id,
				Title: master.Title,
				Description: master.Description,
				ExpiryDate: master.ExpiryDate,
        		Reference_x0020_Link_x0020_1: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.URL1
                },
        		Reference_x0020_Link_x0020_2: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.URL2
                },	
        		Reference_x0020_Link_x0020_3: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.URL3
                },	
        		Reference_x0020_Link_x0020_4: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.URL4
                },	
        		Reference_x0020_Link_x0020_5: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.URL5
                },
                Status:1	
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items";
			
		
			
			return baseService.postRequest(data,url);
		};	

		var updateNews = function(master,itemId){
		
		
			console.log("AnnounceService.UpdateNews is trigged");
			
			var data = {
				__metadata: { 'type': 'SP.Data.AnnouncementListItem' }, //SP.Data.CorporateNewsListItem should be changed
				Division: master.Division,
				Title: master.Title,
				Description: master.Description,
				ExpiryDate: master.ExpiryDate,
        		Reference_x0020_Link_x0020_1: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.Reference_x0020_Link_x0020_1
                },
        		Reference_x0020_Link_x0020_2: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.Reference_x0020_Link_x0020_2
                },	
        		Reference_x0020_Link_x0020_3: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.Reference_x0020_Link_x0020_3
                },	
        		Reference_x0020_Link_x0020_4: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.Reference_x0020_Link_x0020_4
                },	
        		Reference_x0020_Link_x0020_5: 
                {
                    '__metadata': { 'type': 'SP.FieldUrlValue' },
                    'Description': '',
                    'Url': master.Reference_x0020_Link_x0020_5
                }																			
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			return baseService.updateRequest(data,url);
		};

		var updateCoverImageName = function(itemId, filename){
		
			console.log("Update Cover Image Start....");
			var data = {
				__metadata: { 'type': 'SP.Data.AnnouncementListItem' },
				Cover_x0020_Image: filename																		
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			return baseService.updateRequest(data,url);
		};

		var getByItemID = function(itemID) {
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items("+itemID+")?$"; 
			query+="select=ID,Title,Division,Description,ExpiryDate,Cover_x0020_Image,Reference_x0020_Link_x0020_1,Reference_x0020_Link_x0020_2,Reference_x0020_Link_x0020_3,Reference_x0020_Link_x0020_4,Reference_x0020_Link_x0020_5,Modified,LikesCount,Created,Author/Title,Editor/Title,LikedBy/Title&$expand=Author/Title,Editor/Title,LikedBy";
			return baseService.getRequest(query);
		};

		var uploadDocument = function(itemId, file) { 
		
			console.log("UploadDocument:itemId:" + itemId + ",file:"+file); 
			var addUrl = '/_api/web/lists' + "/GetByTitle('"+ listName +"')/GetItemById(" + itemId + ")/AttachmentFiles/add(FileName='" + file.name + "')";
			console.log("UploadDocument:addUrl:" + addUrl); 

			return baseService.ngUploadDocument(file,addUrl); 
		};

		var getUploadedAttachmentList = function(itemId) {	
			console.log("GetUploadedAttachmentList Start....");
			var checkUrl = '/_api/web/lists' + "/GetByTitle('"+ listName +"')/items("+itemId+")/AttachmentFiles";
			console.log("GetUploadedAttachmentList URL...."+checkUrl);

			return baseService.getRequest(checkUrl);
		};

		var deleteDocument = function(itemId, fileName) {
			var checkUrl = "/_api/web/GetFolderByServerRelativeUrl('/sites/reconnect/Lists/"+ listName +"/Attachments/"+itemId+"/"+fileName+"')";
			//console.log(checkUrl);
			return baseService.deleteDocumentRequest(checkUrl);
		};

		var getAttachment = function(itemId, fileName) {	
			var baseUrl = _spPageContextInfo.webAbsoluteUrl;
			var checkUrl = baseUrl+"/Lists/"+ listName +"/Attachments/"+itemId+"/"+fileName;
			//console.log(checkUrl);
			return checkUrl;
		};


		/*** Like or UnLike ************************************/
		var UpdateSPLike = function (itemId) {
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			var data = {
				__metadata: { 'type': 'SP.Data.AnnouncementListItem' },
        		LikesCount: 1 
				//Description: 'ABC123'              																	
			};
			return baseService.UpdateSPLike(data, url);
		};
		
		var getDivisionList = function () 
		{
			var query = listEndPoint + "/GetByTitle('DivisionList')/items?$select=DivCode,Title";
			return baseService.getRequest(query);

		};
		
		var getDivisionNameByCode = function(divCode) 
		{
			var query = listEndPoint + "/GetByTitle('DivisionList')/items?$select=Title";
				query += "&$filter=(DivCode eq '"+ divCode +"')";	
			console.log("getDivisionNameByCode:" + query);
			
			return baseService.getRequest(query);
		}
		
		var getCurrentUser = function()
		{
			var userid = _spPageContextInfo.userId;
			var query = "/_api/web/getuserbyid(" + userid + ")";
			return baseService.getUserInfo(query);

		};
		var getLikeUnlike = function(people)
		{
			var deferred = $q.defer();
			var bliked = false;
			var userid = _spPageContextInfo.userId;
			var query = "/_api/web/getuserbyid(" + userid + ")";
			var sCurrentUser='';

			baseService.getUserInfo(query).then(function (response, status) {
				sCurrentUser = response.d.Title;
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
								bliked = true;								
								break;
							}
						}
					 }
					 if (bliked==true)
					 {
					 	deferred.resolve(true);
					 }
					 else
					 {
					 	deferred.resolve(false);
					 }
				}
				else
				{
					deferred.resolve(false);
				}
			});
			
			
			return deferred.promise;
		}
		
		var deleteNews = function(itemId) {
			var data = {
				__metadata: { 'type': 'SP.Data.AnnouncementListItem' },
				Status: 0																		
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			console.log("DeleteNews at AnnounceService URL:" + url);
			return baseService.updateRequest(data,url);
		};
		
		return{
			getHeaderAnnouncementRange :getHeaderAnnouncementRange ,
			createNews:createNews,
			updateNews:updateNews,
			deleteNews:deleteNews,
			getByItemID:getByItemID,
			deleteDocument:deleteDocument,
			uploadDocument:uploadDocument,
			getUploadedAttachmentList:getUploadedAttachmentList,
			updateCoverImageName:updateCoverImageName,
			getAttachment:getAttachment,
			getAllNewsHeader:getAllNewsHeader,
			getFilteredNewsHeader:getFilteredNewsHeader,
			UpdateSPLike:UpdateSPLike,
			getDivisionList:getDivisionList,
			getDivisionNameByCode:getDivisionNameByCode,
			getCurrentUser:getCurrentUser,
			getLikeUnlike :getLikeUnlike 
		}; //return
	}]); //factory
})(); //function