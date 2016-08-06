
(function () {
    'use strict';
    angular.module('app.login',['ngCookies','app.api'])
    .controller('LoginController', loginController);

    loginController.$inject = ['$scope','$location','loginService'];

    function loginController($scope,$location,loginService) { 
        //validate user credentiials
        $scope.login = function () {
        var userCredentials = {
            userId:$scope.txtEmailId,
            password:$scope.txtpassword
        }
        loginService.login(userCredentials).success(function (response) {
            if (response === 1) {
                loginService.SetCredentials($scope.txtEmailId, $scope.txtpassword);
                $location.path('/');
            } else {
                    swal('Please enter correct user id and password');
            }
             $scope.$emit('login', 'user logged in');
        }); 
        };

    };

})();
