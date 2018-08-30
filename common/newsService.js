"use strict";
(function () {
	var app = angular.module("ReConnectApp");
	app.factory("newsService", ["baseSvc", "sharedService", "globalConfig", function(baseService, sharedService, globalConfig) {
		var listEndPoint = '/_api/web/lists';
		var listName = globalConfig.appListName;

		var createNews = function(master) {
			var data = {
				__metadata: { 'type': 'SP.Data.CorporateNewsListItem' },
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
			sharedService.removeShared();
			sharedService.addShared("AddAction","1");
			return baseService.postRequest(data,url);
		};	

		var updateNews = function(master,itemId){
			var data = {
				__metadata: { 'type': 'SP.Data.CorporateNewsListItem' },
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
			sharedService.removeShared();
			sharedService.addShared("UpdateAction","1");			
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			return baseService.updateRequest(data,url);
		};

		var updateCoverImageName = function(itemId, filename){
			var data = {
				__metadata: { 'type': 'SP.Data.CorporateNewsListItem' },
				Cover_x0020_Image: filename																		
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			sharedService.removeShared();
			sharedService.addShared("UpdateAction","1");			
			return baseService.updateRequest(data,url);
		};

		var getByItemID = function(itemID) {
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items("+itemID+")?$select=ID,Title,Division,Description,ExpiryDate,Status,Cover_x0020_Image,"
			query += "Reference_x0020_Link_x0020_1,Reference_x0020_Link_x0020_2,Reference_x0020_Link_x0020_3,Reference_x0020_Link_x0020_4,Reference_x0020_Link_x0020_5,Modified,Created,LikesCount,"
			query += "LikedBy/Title,Author/Title,Editor/Title&$expand=LikedBy,Author/Title,Editor/Title";
			//query += "&$filter=(Status eq 1)"; //NOT WORK
			console.log("getByItemID Query: "+query);
			return baseService.getRequest(query);
		};		

		var uploadDocument = function(itemId, file) { 
			var addUrl = '/_api/web/lists' + "/GetByTitle('"+ listName +"')/GetItemById(" + itemId + ")/AttachmentFiles/add(FileName='" + file.name + "')";
			sharedService.removeShared();
			sharedService.addShared("UpdateAction","1");			
			return baseService.ngUploadDocument(file,addUrl); 
		};

		var getUploadedAttachmentList = function(itemId) {	
			var checkUrl = '/_api/web/lists' + "/GetByTitle('"+ listName +"')/items("+itemId+")/AttachmentFiles";
			return baseService.getRequest(checkUrl);
		};

		var deleteDocument = function(itemId, fileName) {
			var checkUrl = "/_api/web/GetFolderByServerRelativeUrl('/sites/reconnect/Lists/"+ listName +"/Attachments/"+itemId+"/"+fileName+"')";
			return baseService.deleteDocumentRequest(checkUrl);
		};

		var deleteNews = function(itemId) {
			var data = {
				__metadata: { 'type': 'SP.Data.CorporateNewsListItem' },
				Status: 0																		
			};
			var url = listEndPoint + "/GetByTitle('"+ listName +"')/Items("+itemId+")";
			return baseService.updateRequest(data,url);
		};

		var getAttachment = function(itemId, fileName) {	
			var baseUrl = _spPageContextInfo.webAbsoluteUrl;
			var checkUrl = baseUrl+"/Lists/"+ listName +"/Attachments/"+itemId+"/"+fileName;
			return checkUrl;
		};

		/*** Select ALL records ************************************/
		var getAllNewsHeader = function() {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$select=ID,Title,Division,Description,ExpiryDate,Status,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
				query += "&$filter=(ExpiryDate ge datetime'"+today.toISOString()+"')";		
				query += "and (Status eq 1)";		
			console.log("getAllNewsHeader Query: "+query);
			return baseService.getRequest(query);
		};

		/*** Select TOP 10 records where cover image is NOT null ************************************/
		var getFilteredNewsHeader = function () {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$select=ID,Title,Division,Description,ExpiryDate,Status,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
				query += "&$filter=(ExpiryDate ge datetime'"+today.toISOString()+"')";	
				query += "and (Cover_x0020_Image ne null)";
				query += "and (Status eq 1)";
			console.log("getFilteredNewsHeader Query: "+query);
			return baseService.getRequest(query);
		};

		/*** Select filtered date range News  ************************************/
		var getFilteredDateRangeNewsHeader = function (fromDate, toDate, division) {
			var today = new Date();		
			var fDate = new Date(fromDate);
			var tDate = new Date(toDate);	
			var query = listEndPoint + "/GetByTitle('"+ listName +"')/items?$select=ID,Title,Division,Description,ExpiryDate,Status,Cover_x0020_Image,Modified,Created,Author/Title,Editor/Title,LikesCount&$expand=Author/Title,Editor/Title";
				query += "&$filter=(ExpiryDate ge datetime'"+today.toISOString()+"')";	
				query += "and (Created ge datetime'"+fDate.toISOString()+"')";
				query += "and (Created le datetime'"+tDate.toISOString()+"')";
				if (division != '')
					query += "and (Division eq '"+division+"')";
				query += "and (Status eq 1)";
			console.log("getFilteredDateRangeNewsHeader Query: "+query);
			return baseService.getRequest(query);
		};

		var getCurrentUser = function() {
			var userid = _spPageContextInfo.userId;
			var query = "/_api/web/getuserbyid(" + userid + ")";
			return baseService.getRequest(query);
		};

		var getDivisionList = function () 
		{
			var query = listEndPoint + "/GetByTitle('DivisionList')/items?$select=DivCode,Title&$orderby=Title";
			return baseService.getRequest(query);
		};

		var getDivisionNameByCode = function(divCode) 
		{
			var query = listEndPoint + "/GetByTitle('DivisionList')/items?$select=Title";
				query += "&$filter=(DivCode eq '"+ divCode +"')";	
			console.log(query);
			return baseService.getRequest(query);
		}				

		return{
			createNews:createNews,
			updateNews:updateNews,
			getByItemID:getByItemID,
			deleteDocument:deleteDocument,
			uploadDocument:uploadDocument,
			getUploadedAttachmentList:getUploadedAttachmentList,
			updateCoverImageName:updateCoverImageName,
			getAttachment:getAttachment,
			getAllNewsHeader:getAllNewsHeader,
			getFilteredNewsHeader:getFilteredNewsHeader,
			getFilteredDateRangeNewsHeader:getFilteredDateRangeNewsHeader,
			deleteNews:deleteNews,
			getCurrentUser:getCurrentUser,
			getDivisionList:getDivisionList,
			getDivisionNameByCode:getDivisionNameByCode
		}; //return
	}]); //factory
})(); //function