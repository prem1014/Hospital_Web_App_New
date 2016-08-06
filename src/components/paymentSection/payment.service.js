(function(){
	'use strict';
	angular.module('app.payment')
	.factory('PaymentService',paymentService);

	paymentService.$inject=['$http'];

	function paymentService($http){
        var service = {};
        var response = {};
        var uri = "http://localhost:2054//api/";

        service.getPatientBalanceAmount = function (patientId) {
            response = $http({
                url: uri + 'BalanceAmount' + '/' + patientId,
                method: "GET",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.getPaymentDetails = function (paymentNo) {
            response = $http({
                url: uri + 'Payment' + '/' + paymentNo,
                method: "GET",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.addNewPayment = function (payment) {
            response = $http({
                url: uri + 'payment',
                data: JSON.stringify(payment),
                method: "POST",
                dataType: "json",
                async: false,
            });
            return response;
        };

        service.deletePaymentById = function (patientId) {
            response = $http({
                url: uri + 'payment' + '/' + patientId,
                method: "DELETE",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.updatePayment = function (payment) {
            response = $http({
                url: uri + 'payment',
                data: JSON.stringify(payment),
                method: "PUT",
                dataType: "json",
                async: false,
            });
            return response;
        };

        return service;

	}
})();