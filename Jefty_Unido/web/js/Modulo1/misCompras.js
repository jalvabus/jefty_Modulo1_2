let app = angular.module('carritoApp', []);

app.controller('carritoController', ($scope, $http) => {

    $scope.usuario = [];

    $scope.validateLogin = function () {
        let params = "?action=authlogin";
        $http({
            method: 'POST',
            url: 'auth' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }

            let data = response.data;
            console.log(data);
            if (data.nomUsuario) {
                $scope.usuario = response.data;
                $scope.getCompras();
            } else {
                location.replace("index.jsp");
            }
        });
    };

    $scope.logout = function () {
        let params = "?action=logout";
        $http({
            method: 'POST',
            url: 'auth' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }
            console.log(response.data);
            $scope.usuario = response.data;
            location.replace("index.jsp");
        });
    };

    $scope.validateLogin();
    $scope.misCompras = [];

    $scope.getCompras = function () {
        let params = "?action=getMisCompras";
        $http({
            method: 'POST',
            url: 'compra' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }
            console.log(response.data);
            $scope.misCompras = response.data;
        });
    };

    $scope.compra = [];

    $scope.detallesVenta = function (venta) {
        let params = "?action=getDetalleCompra&id_venta=" + venta.id_venta;
        $http({
            method: 'POST',
            url: 'compra' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }
            console.log(response.data);
            $scope.compra = response.data;
        });
    };

});
