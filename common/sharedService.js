"use strict";
(function (){
	angular.module("ReConnectApp").factory("sharedService",function() {
        
        var sharedList = {};

        var addShared = function(key, value) {
            sharedList[key] = value;
        };

        var getShared = function(key){
            return sharedList[key];
        };

        var removeShared = function() {
            sharedList = {};
        };

        var validateDateObjects = function( todayFormatted, thisExpiryDate ){
            if (todayFormatted > thisExpiryDate) {
                return false;
            } else if (thisExpiryDate > todayFormatted) {
                return true;
            } else {
                return false;
            }
        }        

        return {
            addShared: addShared,
            getShared: getShared,
            removeShared: removeShared,
            validateDateObjects:validateDateObjects
        };

    });
})();