(function () {
    angular.module('app.socketService',[])
        .factory('SocketService',socketService);

    socketService.$inject=['socket'];

    function socketService(socket){
        var service={
            listenSocket:listenSocket
        };

        return service;

        function listenSocket(eventType,callback){
            socket.on(eventType,callback);
        }
    }
})();
