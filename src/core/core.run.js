(function(){
	angular.module('app.core')
	.run(runAppCore);

runAppCore.$inject=['$rootScope', '$location', '$cookieStore', '$http']
	function runAppCore($rootScope, $location, $cookieStore, $http){
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

      /*  $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/Login' && !$rootScope.globals.currentUser) {
                $location.path('/Login');
            }
        });*/
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !$rootScope.globals.currentUser) {
                // User isn’t authenticated
                $state.transitionTo("Login");
                event.preventDefault();
            }
        });
	}
})();