(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('Login', {
                url: '/Login',
                templateUrl: 'components/login/login.html',
                controller:'LoginController',
                authenticate: false
            })
            .state('SignUp', {
                url: '/SignUp',
                templateUrl: 'components/userRegistration/signUp.html',
                controller:'UserRegistrationCtrl',
                authenticate: false
            })            
            .state("PatientReg", {
               url: "/PatientReg",
               templateUrl: 'components/patientRegistration/patientRegistration.html',
               controller: 'PatientRegiCtrl',
               authenticate: false
            })
            .state("BillEntry", {
               url: "/BillEntry",
               templateUrl: 'components/billSection/bill.html',
               controller: 'BillCtrl',
               authenticate: false
            })
            .state("PaymentRecvForm", {
               url: "/PaymentRecvForm",
               templateUrl: 'components/paymentSection/payment.html',
               controller: 'PaymentCtrl',
               authenticate: false
            })                       
    }
})();
