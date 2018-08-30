"use strict";
(function () {
    angular.module("ReConnectApp")
        .factory("baseSvc", ["$http", "$q", "sharedService", "Upload", "$location", function($http, $q, sharedService, Upload, $location) {
        var baseUrl = _spPageContextInfo.webAbsoluteUrl;
        var getRequest = function (query) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + query,
                method: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-Type": "application/json;odata=verbose"
                }
            })
                .success(function (result) {
                 console.log("OK");

                deferred.resolve(result);
            })
                .error(function (result, status) {
                 console.log("Problem found");
                deferred.reject(status);
              
                
                $location.path('/CommonError');
            });
            return deferred.promise;
        };        
        var postRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data)
            })
                .success(function (result) {
                deferred.resolve(result);
            })
                .error(function (result, status) {
                deferred.reject(status);
                $location.path('/CommonError');
            });
            return deferred.promise;
        };
        var uploadDocument = function (file,url) {                	
            var deferred = $q.defer();
            console.log("baseSvc file:" + file.name + " Triggered");
            var reader= new FileReader();
			 reader.onloadend = function (evt) {
		        if (evt.target.readyState == FileReader.DONE) {
		            console.log("baseSvc file:" + file.name + " Start");
					var dataBuffer = evt.target.result;
		            $http({
		                url: baseUrl + url,
		                method: "POST",
						headers: {
	                   	    "Accept": "application/json; odata=verbose",
     						"X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
     						"Content-Type": undefined,
     						"content-length": dataBuffer.byteLength
     					},
     					transformRequest: angular.identity,
		                data: dataBuffer
		            }).success(function (result) {
		            	console.log("baseSvc file:" + file.name + " Success Get result:" + JSON.stringify(result));
		                deferred.resolve(result);
		            }) .error(function (result, status) {
		            	console.log("baseSvc file:" + file.name + " baseSvc Error Get status:" +  JSON.stringify(result));
		                deferred.reject(status);
                        $location.path('/CommonError');
		            });
		        }
		    };
			reader.readAsArrayBuffer(file);
			return deferred.promise;
        };    
        var ngUploadDocument = function (file,url) {      
            var deferred = $q.defer(); 
            file.upload = Upload.http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "Content-Type": undefined,
                    "content-length": file.byteLength
                },
                transformRequest: angular.identity,
                data: file
            }).success(function (response) {
                //console.log("baseSvc file:" + file.name + " Success Get result:" + JSON.stringify(response));
                deferred.resolve(response);
            }) .error(function (response, status) {
                //console.log("baseSvc file:" + file.name + " baseSvc Error Get status:" +  JSON.stringify(response));
                deferred.reject(status);
                $location.path('/CommonError');
            });
            return deferred.promise;
        };
        var updateRequest = function (data, url) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "PATCH",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "content-Type": "application/json;odata=verbose",
                    "X-Http-Method": "PATCH",
                    "If-Match": "*"
                },
                data: JSON.stringify(data)
            })
            .success(function (result) {
                deferred.resolve(result);
            })
            .error(function (result, status) {
                deferred.reject(status);
                $location.path('/CommonError');
            });
            return deferred.promise;
        };
        var deleteRequest = function(url){
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "DELETE",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,
                    "IF-MATCH": "*"
                }
            })
            .success(function (result) {
                deferred.resolve(result);
            })
            .error(function (result, status) {
                deferred.reject(status);
                $location.path('/CommonError');
            });
            return deferred.promise;
        };
        var deleteDocumentRequest = function(url){
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest":document.getElementById("__REQUESTDIGEST").value,
                    "IF-MATCH": "*",
                    "X-HTTP-Method":"DELETE"
                }
            })
            .success(function (result) {
                deferred.resolve(result);
            })
            .error(function (result, status) {
                deferred.reject(status);
                $location.path('/CommonError');
            });
            return deferred.promise;
        };        
        var UpdateSPLike = function(data, url){
            var deferred = $q.defer();
            $http({
                url: baseUrl + url,
                method: "POST",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
                    "content-Type": "application/json;odata=verbose"
                },
                data: JSON.stringify(data)
            })
                .success(function (result) {
                deferred.resolve(result);
            })
                .error(function (result, status) {
                deferred.reject(status);
            });
            return deferred.promise;
        };          
        
        var getUserInfo = function (query) {
            var deferred = $q.defer();
            $http({
                url: baseUrl + query,
                method: "GET",
                headers: {
                    "accept": "application/json;odata=verbose",
                    "content-Type": "application/json;odata=verbose"
                }
            })
                .success(function (result) {
                console.log("baseURL:" + baseUrl+ query);
	            deferred.resolve(result);
            })
                .error(function (result, status) {
                 console.log("baseURL:" + baseUrl+ query);
                 
                deferred.reject(status);
            });
            return deferred.promise;
        };

 
        return {
            getRequest: getRequest,
            postRequest: postRequest,
            uploadDocument:uploadDocument,
            ngUploadDocument:ngUploadDocument,
            updateRequest: updateRequest,
            deleteRequest:deleteRequest,
            deleteDocumentRequest:deleteDocumentRequest,
            UpdateSPLike:UpdateSPLike,
            getUserInfo:getUserInfo
        };
    }]);
})();