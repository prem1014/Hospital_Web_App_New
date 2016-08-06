(function() {
    'use strict';

    angular.module('hms.app', [
        // Common (everybody has access to these)
        'app.core',

        // Features (listed alphabetically)
        'app.login',
        'app.signout',
        'app.signUp',
        'app.patientRegistration',
        'app.bill',
        'app.payment'
    ]).
    controller('IndexCtrl',indexCtrl)

    indexCtrl.$inject=['$scope', '$rootScope', '$cookieStore'];

    function indexCtrl($scope, $rootScope, $cookieStore){
             if ($cookieStore.get('globals') != undefined) {
                $scope.login = false;
                $scope.logOut = true;
                $scope.loggedInUser = 'Welcome:' + ' ' + $cookieStore.get('globals').currentUser.username;
            }
            else {
                $scope.login = true;
                $scope.logOut = false;
            }
            $scope.$on('login', function () {
                $scope.login = false;
                $scope.logOut = true;
                $scope.loggedInUser = 'Welcome:' + ' ' + $cookieStore.get('globals').currentUser.username;
            });
            $scope.$on('signOut', function () {
                $scope.login = true;
                $scope.logOut = false;
                $scope.loggedInUser = ''
            });       
    }
})();
