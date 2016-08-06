(function(){
	'use strict';
	angular.module('app.signUp',[])
	.controller('UserRegistrationCtrl',userRegistrationCtrl);

	userRegistrationCtrl.$inject=['$scope','$http'];

	function userRegistrationCtrl($scope,$http){
        $scope.txtsecQuestion = "Select Security Question";
        $scope.signUp = function () {
            var userDetails = {};
            if ($scope.myform.$valid) {
                userDetails.firstName = $scope.txtFname;
                userDetails.lastName = $scope.txtLname;
                userDetails.emailId = $scope.txtEmail;
                userDetails.password = $scope.txtpassword;
                userDetails.mobileNo = $scope.txtMobile;
                userDetails.secQuestion = $scope.txtsecQuestion;
                userDetails.secAnswer = $scope.txtsecAnswer;
                $http.post('webapi', userDetails).
                success(function (response) {
                    console.log(response);
                })
            }
            else {
                $scope.submitted = true;
            }
        }		
	}
})();