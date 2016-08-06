(function(){
	'use strict';
	angular.module('app.patientRegistration')
	.factory('PatientService',patientService);

	patientService.$inject=['$http'];

	function patientService($http){
        var service = {};
        var response = {};
        var uri = "http://localhost:2054//api/";

        service.getPatientDataById = function (patientId) {
            response = $http({
                url: uri + 'patientRegstration' + '/' + patientId,
                method: "GET",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.getPatientData = function () {
           return $http.get(uri + 'patientRegstration');
        }

        service.addNewPatient = function (patient) {
            response = $http({
                url: uri + 'patientRegstration',
                data: JSON.stringify(patient),
                method: "POST",
                dataType: "json",
                async: false,
            });
            return response;
        };

        service.deletePatientById = function (patientId) {
            response = $http({
                url: uri + 'patientRegstration' + '/' + patientId,
                method: "DELETE",
                dataType: "json",
                async: false,
            })
            return response;
        };

        service.updatePatient = function (patient) {
            response = $http({
                url: uri + 'patientRegstration',
                data: JSON.stringify(patient),
                method: "PUT",
                dataType: "json",
                async: false,
            });
            return response;
        };

        service.getReferedByList = function () {
            response = $http({
                url: uri + 'referedBy',
                method: 'GET',
                dataType: 'joson'
            });
            return response;
        };
        service.getDeparmentList = function () {
            response = $http({
                url: uri + 'department',
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