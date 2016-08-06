'use strict';
(function () {
    angular.module('app.login')
    .factory('loginService', loginService);

    loginService.$inject=['$rootScope','$http','$cookieStore']
    
    function loginService($rootScope,$http,$cookieStore) {
        var service = {};
        service.login = function (userCredentials) {
            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
           /* $timeout(function () {
                var response = { success: username == 'hms@gmail.com' && password == '123' };
                if (!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);8?


            /* Use this for real authentication
                 ----------------------------------------------*/
            return $http.get('webapi'+userCredentials);
        };

        service.SetCredentials = function (username, password) {
            //var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                   // authdata: authdata
                }
            };

            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;       
    };

})();
