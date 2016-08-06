(function(){
	'use strict';
	angular.module('app.bill')
	.factory('BillService',billService);

	billService.$inject=['$http'];

	function billService($http){
        var service = {};
        var response = {};
        var uri = "http://localhost:2054//api/";

        service.getBillDetails = function (billNo) {
            response = $http({
                url: uri + 'PatientBill' + '/' + billNo,
                method: "GET",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.addNewBill = function (patientBill) {
            patientBill= JSON.stringify(patientBill)
            response = $http({
                url: uri + 'PatientBill',
                data: patientBill,
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                async: false,
            });
            return response;
        };

        service.deleteBill = function (billNo) {
            response = $http({
                url: uri + 'PatientBill' + '/' + billNo,
                method: "DELETE",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.updateBill = function (bill) {
            response = $http({
                url: uri + 'PatientBill',
                data: JSON.stringify(bill),
                method: "PUT",
                dataType: "json",
                async: false,
            });
            return response;
        };

        service.getChargeList = function () {
            response = $http({
                url: uri + 'Charge',
                method: 'GET',
                dataType: 'joson'
            });
            return response;
        };

        service.getLabList = function () {
            response = $http({
                url: uri + 'Lab',
                method: 'GET',
                dataType: 'joson'
            });
            return response;
        };
        
        service.getPatientTypeList = function () {
            response = $http({
                url: uri + 'patientType',
                method: 'GET',
                dataType: 'joson'
            });
            return response;
        };
        return service;

	}
})();