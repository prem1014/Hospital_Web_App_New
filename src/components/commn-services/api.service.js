(function () {
    angular.module('app.api', [])
        .factory('DataService', dataService);

    dataService.$inject = ['$http', '$q', 'socket'];

    function dataService($http, $q, socket) {
        var orders = [],
            service = {
                createOrders:createOrders,
                getOrders:getOrders,
                getUsers:getUsers,
                deleteAllOrders:deleteAllOrders,
                getInstruments:getInstruments
            };

        return service;

        function createOrders (generatedOrders) {

            var def = $q.defer();

            generatedOrders.forEach(function (order) {
                $http.post('http://localhost:8080/orders', order)
                    .then(function (response) {
                        def.resolve(response.data);
                    })
                    .catch(function (error) {
                        def.reject('Server encountered error: ' + error);
                    })
            })
            return def.promise;
        }

        function getOrders () {

            var def = $q.defer();

            $http.get('http://localhost:8080/orders')
                .then(function (response) {
                    if (response.data.length > 0) {
                        console.log('Now orders are available from server');
                        orders = response.data;
                        def.resolve(orders);
                    }
                    else {
                        alert('Orders are not available, please create order');
                    }
                })
                .catch(function (error) {
                    def.reject('Server encountered error: ' + error);
                })
            return def.promise;
        }

        function getUsers () {

            var users,
            def=$q.defer();

            $http.get('http://localhost:8080/users')
                .then(function (response) {
                    def.resolve(users=response.data);
                    console.log('Now users are available from server');
                })
                .catch(function (error) {
                    def.reject('Server encountered error: ' + error)
                })
            return def.promise;
        }

        function deleteAllOrders () {

            var def=$q.defer();

            var response = $http.delete('http://localhost:8080/orders')
                .then(function () {
                    def.resolve();
                    console.log('All orders deleted successfully');
                })
                .catch(function (error) {
                    def.reject('Server encountered error: '+error);
                })
            return def.promise;
        }

        function getInstruments () {

            var def = $q.defer();

            $http.get('http://localhost:8080/instruments')
                .then(function (response) {
                    def.resolve(response.data);
                    console.log('Instruments are available');
                })
                .catch(function (error) {
                    def.reject('Server encountered error: ' + error);
                })
            return def.promise;
        }

    }
})();
