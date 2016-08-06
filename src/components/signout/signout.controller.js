(function(){
	angular.module('app.signout',['app.login'])
	.controller('SignOutController',signOutController);

	signOutController.$inject=['$location','loginService'];

	function signOutController($location,loginService){
		loginService.clearCredentials();
        $location.path('/login');
	}
})();
