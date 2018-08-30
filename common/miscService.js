"use strict";
(function () {
	var app = angular.module("ReConnectApp");
	app.factory("miscService", ["baseSvc", "sharedService", "globalConfig", function(baseService, sharedService, globalConfig) {
		var listEndPoint = '/_api/web/lists';
		var divPageListName = globalConfig.appDivPageListName;

		/**************** Select ALL records **********************/
		var getAllPageHeader = function() {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ divPageListName +"')/items?$select=ID,Title,Division,ProgramType,ProgramName,url,Description,Created";
				//query += "&$filter=(Division eq '		
				//query += "and (Status eq 1)";		
			console.log("Query: "+query);
			return baseService.getRequest(query);
		};

        /**************** Select filtered records **********************/
        var getFilteredPageHeader = function(Id) {
			var today = new Date();			
			var query = listEndPoint + "/GetByTitle('"+ divPageListName +"')/items?$select=ID,Title,Division,ProgramType,ProgramName,url,Description,Created";
            if(Id != "ALL" && Id != "") {
				query += "&$filter=(Division eq '" + Id + "' )";
            }				
			console.log("Query: "+query);
			return baseService.getRequest(query);
        };    

  		/**************** Select filtered Divisions **********************/
		var getDivisionList = function () 
		{
			var query = listEndPoint + "/GetByTitle('DivisionList')/items?$select=DivCode,Title&$orderby=Title";
			return baseService.getRequest(query);
		};		

		return{
			getAllPageHeader:getAllPageHeader,
            getFilteredPageHeader:getFilteredPageHeader,
			getDivisionList:getDivisionList
		}; //return
	}]); //factory
})(); //function