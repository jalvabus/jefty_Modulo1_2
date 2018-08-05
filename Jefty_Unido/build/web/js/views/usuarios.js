let app = angular.module('usuarioApp', []);

app.controller('usuarioController', ($scope, $http) => {

    $scope.usuario = [];
    $scope.platillos = [];
    $scope.tipoOrden = [];
    $scope.detailsPedido = [];

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

    $scope.getPlatillos = function () {

        let platillos = $scope.tipoOrden.tipo;
        let params = "?action=" + platillos;

        if (!localStorage.getItem("tpoOrden")) {
            localStorage.setItem('tipoOrden', $scope.tipoOrden.tipo);
        }

        $http({
            method: 'POST',
            url: 'Cliente' + params
        }).then((response, err) => {
            if (err) {
                console.log("Error obteniendo platillos: " + err);
            } else {
                console.log(response.data);
                $scope.platillos = response.data;
            }
        });
    };

    $scope.ver = function () {
        console.log("Viendo detalles");
    };

    $scope.validateLogin();

    $scope.agregarOrden = function (platillo) {
        let plato = this.platillo;
        console.log(plato);
        let existe = -1;
        if (!localStorage.getItem("orden")) {
            localStorage.setItem('orden', JSON.stringify({productos: []}));
        }

        var ordenActual = JSON.parse(localStorage.getItem("orden"));

        ordenActual.productos.forEach((elemento, i) => {
            if (plato.id_platillo === elemento.id_platillo) {
                existe = i;
            }
        });

        if (existe === -1) {
            plato.CANTIDAD = 1;
            ordenActual.productos.push(plato);
        } else {
            ordenActual.productos[existe].CANTIDAD++;
        }

        localStorage.setItem("orden", JSON.stringify(ordenActual));
        console.log(ordenActual);
        swal("Agregaste el platillo '" + platillo.nombre + "' a tu orden !", "", "success");
    };

    $scope.limpiarOrden = function () {
        localStorage.setItem("orden", JSON.stringify({productos: []}));
        var divContenido = $('#contenidoOrden');
        divContenido.empty();
    };

    $scope.verCarrito = function () {
        location.replace("Carrito.jsp");
    };

    $scope.verCarritoPaquete = function () {
        location.replace("CarritoPaquete.jsp");
    };

    // $scope.limpiarOrden();

    /**
     * 
     * @returns {undefined}
     */
    $scope.mesa = [];
    $scope.chooseMesa = function (mesa) {
        $scope.mesa = mesa;
    };
    $scope.mesas = {};

    $scope.getMesas = function () {
        let params = "?action=getMesas";
        $http({
            method: 'POST',
            url: 'mesas' + params
        }).then((response, err) => {
            if (err) {
                console.log("Error obteniendo platillos: " + err);
            } else {
                console.log(response.data);
                $scope.mesas = response.data;
            }
        });
    };

    $scope.getMesas();
    $scope.reservacion = {};

    $scope.reservarMesa = function () {
        let fecha = $('#fechaReservacion').val();
        let hora = $('#horaReservacion').val();
        let comensales = $('#comensales').val();
        let mesa = $scope.mesa;
        let usuario = $scope.usuario;
        let params = "?action=reservarMesa"
                + "&id_usuario=" + usuario.id_usuario
                + "&id_mesa=" + mesa.id_mesa
                + "&fecha=" + fecha
                + "&hora=" + hora
                + "&comensales=" + comensales;
        console.log(params);
        $http({
            method: 'POST',
            url: 'mesas' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }
            let data = response.data;
            console.log(data);
            if (Number(response.data) === 0) {
                swal({
                    title: "No puede apartar mas mesas",
                    text: "Usted ya cuenta con una mesa apartada!",
                    icon: "warning",
                    button: "Aceptar",
                });
            }
            if (Number(response.data) === 1) {
                swal({
                    title: "Reservacion Exitosa!",
                    text: "Su reservacion se ah guardado!",
                    icon: "success",
                    button: "Aceptar",
                });
                $scope.reload();
            }
            if (Number(response.data) === 404) {
                swal({
                    title: "Ocurrio un error!",
                    text: "Lo sentimos ah ocurrido un error!",
                    icon: "warning",
                    button: "Aceptar",
                });
            }
        });
    };

    $scope.reload = function () {
        $scope.getMesas();
    };

    $scope.paquetes = [];
    $scope.getPaquetes = function () {
        let platillos = $scope.tipoOrden.tipo;
        let params = "?action=" + platillos;
        $http({
            method: 'POST',
            url: 'paquete' + params
        }).then((response, err) => {
            if (err) {
                console.log("Error obteniendo platillos: " + err);
            } else {
                console.log(response.data);
                $scope.paquetes = response.data;
            }
        });
    };

    $scope.paquete = [];
    $scope.agregarOrdenPaquete = function (paquete) {
        $scope.paquete = paquete;
    };


    $scope.verificacionTarjeta = false;
    $scope.verificacionTarjetaCompleto = false;
    $scope.saldo = null;
    $scope.end = false;
    $scope.tipopago = null;
    $scope.tarjeta = null;

    $scope.getSaldoTarjeta = function () {
        let noTarjeta = document.getElementById('saldoTarjeta').value;

        let e = document.getElementById("tipopago");
        let tipoPago = e.options[e.selectedIndex].value;
        $scope.tipopago = tipoPago;
        $scope.tarjeta = noTarjeta;

        let action = null;
        console.log(tipopago);

        if (tipoPago === 'credito') {
            action = "getSaldoCredito";
        }
        if (tipoPago === 'prepago') {
            action = "getSaldoPrepago";
        }

        let params = "?action=" + action + "&id_usuario= " + $scope.usuario.id_usuario + "&no_tarjeta=" + noTarjeta;
        console.log(params);
        $http({
            method: 'POST',
            url: 'tarjetas' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }

            let data = response.data;
            console.log(data);
            if (tipoPago === 'prepago') {
                if (data.saldo) {
                    $scope.saldo = data.saldo;
                    $scope.end = true;
                    if (data.saldo < $scope.paquete.costo) {
                        swal({
                            title: "No centa con saldo suficiente!",
                            text: "",
                            icon: "warning",
                            button: "Ok!"
                        });
                        $scope.verificacionTarjeta = false;
                        $scope.verificacionTarjetaCompleto = true;
                    } else {
                        swal({
                            title: "Tarjeta Correcta !",
                            text: "Confirme la compra",
                            icon: "warning",
                            button: "Ok!"
                        });
                        $scope.verificacionTarjeta = true;
                    }
                } else {
                    swal({
                        title: "Error en la tajeta!",
                        text: "No se encontraron resultados!",
                        icon: "warning",
                        button: "Ok!"
                    });
                }
            }
            if (tipoPago === 'credito') {
                if (data.saldo) {
                    $scope.verificacionTarjeta = true;
                    $scope.verificacionTarjetaCompleto = true;
                    $scope.saldo = data.saldo;
                    $scope.end = true;
                    swal({
                        title: "Tarjeta Correcta",
                        text: "El pago se cargara a su tarjeta de credito",
                        icon: "warning",
                        button: "Ok!"
                    });
                } else {
                    swal({
                        title: "Error en la tajeta!",
                        text: "No se encontraron resultados!",
                        icon: "warning",
                        button: "Ok!"
                    });
                }
            }
        });
    };

    $scope.comprarPaquete = function () {
        console.log($scope.paquete);
        console.log($scope.saldo);
        console.log($scope.tipopago);
        console.log($scope.tarjeta);

        let nuevoSaldo = Number($scope.saldo) - Number($scope.paquete.costo);

        let params = "?action=comprarPaquete";
        params += "&id_paquete=" + $scope.paquete.id_paquete
                + "&costo=" + $scope.paquete.costo
                + "&tipoCompra=" + $scope.tipopago
                + "&notarjeta=" + $scope.tarjeta
                + "&nuevoSaldo=" + nuevoSaldo;
        console.log(params);
        $http({
            method: 'POST',
            url: 'paquete' + params
        }).then((response, err) => {
            if (err) {
                console.log("Error obteniendo platillos: " + err);
            } else {
                console.log(response.data);
                swal({
                    title: "Paquete comprado!",
                    text: "Compraste el paquete!",
                    icon: "success",
                    button: "Aceptar!"
                });
                $scope.reload();
            }
        });
    };

    /**
     * ***************************************************
     * ***************  MODULO LUCY  *********************
     * ***************************************************
     */

    $scope.platillosPedido = [];

    $scope.getPlatillosPedido = function () {
        let params = "?action=individual";
        $http({
            method: 'POST',
            url: 'Cliente' + params
        }).then((response, err) => {
            if (err) {
                console.log("Error obteniendo platillos: " + err);
            } else {
                console.log(response.data);
                $scope.platillosPedido = response.data;
            }
        });
    };

    $scope.getPlatillosPedido();

    $scope.agregarPedido = function (platillo) {
        let plato = this.platillo;
        console.log(plato);
        let existe = -1;
        if (!localStorage.getItem("pedido")) {
            localStorage.setItem('pedido', JSON.stringify({productos: []}));
        }

        var ordenActual = JSON.parse(localStorage.getItem("pedido"));

        ordenActual.productos.forEach((elemento, i) => {
            if (plato.id_platillo === elemento.id_platillo) {
                existe = i;
            }
        });

        if (existe === -1) {
            plato.CANTIDAD = 1;
            ordenActual.productos.push(plato);
        } else {
            ordenActual.productos[existe].CANTIDAD++;
        }

        localStorage.setItem("pedido", JSON.stringify(ordenActual));
        console.log(ordenActual);
        swal("Agregaste el platillo '" + platillo.nombre + "' a tu pedido !", "", "success");
    };

    $scope.pedido = [];
    $scope.precio = [];
    $scope.showForm = false;

    $scope.cargar = function () {
        if (!localStorage.getItem("pedido")) {
            localStorage.setItem("pedido", JSON.stringify({productos: []}));
        }

        let orden = JSON.parse(localStorage.getItem("pedido"));
        $scope.pedido = orden.productos;
        console.log("Pedido");
        console.log(orden);
    };

    $scope.cargar();

    $scope.cargarDatos = function () {

        if (!localStorage.getItem("pedido")) {
            localStorage.setItem("pedido", JSON.stringify({productos: []}));
        }

        var total = 0;

        let orden = JSON.parse(localStorage.getItem("pedido"));
        $scope.pedido = orden.productos;
        console.log($scope.pedido);
        $scope.pedido.forEach(function (p) {
            total += p.CANTIDAD * p.precio;
        });

        let descuento = 0;

        if (Number($scope.comprasCliente) > 5) {
            descuento = 0.05;
        } else {
            descuento = 0;
        }

        $scope.precio.subtotal = total;
        $scope.precio.iva = total * 0.16;
        $scope.precio.total = total * 1.16;
        $scope.precio.descuento = total * 1.16 * descuento;

        if (Number($scope.precio.subtotal) < 300) {
            $scope.precio.envio = 100;
        } else {
            $scope.precio.envio = 0;
        }

        $scope.precio.totalFinal = (total * 1.16) - (total * 1.16 * descuento) + Number($scope.precio.envio);
        console.log($scope.precio);
    };

    $scope.limpiarOrden = function () {
        localStorage.setItem("pedido", JSON.stringify({productos: []}));
        $scope.pedido = [];
        $scope.precio.total = 0.0;
    };

    $scope.eliminarCarrito = function (platillo) {

        if (!localStorage.getItem("pedido")) {
            localStorage.setItem("pedido", JSON.stringify({productos: []}));
        }

        var total = 0;

        var ordenActual = JSON.parse(localStorage.getItem("pedido"));

        let nuevaOrden = {
            productos: []
        };

        ordenActual.productos.forEach(function (p) {
            if (p.id_platillo !== platillo.id_platillo) {
                total += p.CANTIDAD * p.precio;
                nuevaOrden.productos.push(p);
            }
        });

        localStorage.setItem("pedido", JSON.stringify(nuevaOrden));

        $scope.pedido = nuevaOrden.productos;

        $scope.precio.subtotal = total;
        $scope.precio.iva = total * 0.16;
        $scope.precio.total = total * 1.16;
        $scope.precio.apartado = Number(total) / 2;
    };

    $scope.reCalcular = function (platillo) {

        let valor = document.getElementById(platillo.id_platillo + 'platillo').value;
        var total = 0;
        var ordenActual = JSON.parse(localStorage.getItem("pedido"));

        ordenActual.productos.forEach((elemento, i) => {
            if (platillo.id_platillo === elemento.id_platillo) {
                ordenActual.productos[i].CANTIDAD = Number(valor);
            }
        });

        ordenActual.productos.forEach(function (p) {
            total += p.CANTIDAD * p.precio;
        });

        localStorage.setItem("pedido", JSON.stringify(ordenActual));

        $scope.pedido = ordenActual.productos;

        $scope.precio.subtotal = total;
        $scope.precio.iva = total * 0.16;
        $scope.precio.total = total * 1.16;
        $scope.precio.apartado = Number(total) / 2;

    };

    $scope.cancelar = function () {
        $scope.showForm = false;
    };

    $scope.verificacionTarjeta = false;
    $scope.verificacionTarjetaCompleto = false;
    $scope.tipopago = null;
    $scope.tarjeta = null;
    $scope.saldo = null;

    $scope.getSaldoTarjeta1 = function () {
        let noTarjeta = document.getElementById('saldoTarjetaPedido').value;

        let e = document.getElementById("tipopago");
        let tipoPago = e.options[e.selectedIndex].value;
        $scope.tipopago = tipoPago;
        $scope.tarjeta = noTarjeta;

        let action = null;
        console.log(tipopago);

        if (tipoPago === 'credito') {
            action = "getSaldoCredito";
        }
        if (tipoPago === 'prepago') {
            action = "getSaldoPrepago";
        }

        let params = "?action=" + action + "&id_usuario= " + $scope.usuario.id_usuario + "&no_tarjeta=" + noTarjeta;
        console.log(params);
        $http({
            method: 'POST',
            url: 'tarjetas' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }

            let data = response.data;
            console.log(data);
            if (tipoPago === 'prepago') {
                if (data.saldo >= 0) {
                    $scope.saldo = data.saldo;
                    $scope.end = true;
                    if (data.saldo < $scope.precio.totalFinal) {
                        swal({
                            title: "No centa con saldo suficiente!",
                            text: "",
                            icon: "warning",
                            button: "Ok!"
                        });
                        $scope.verificacionTarjeta = false;
                        $scope.verificacionTarjetaCompleto = false;
                    } else {
                        swal({
                            title: "Tarjeta Correcta !",
                            text: "Confirme la compra",
                            icon: "warning",
                            button: "Ok!"
                        });
                        $scope.verificacionTarjeta = true;
                        $scope.verificacionTarjetaCompleto = true;
                    }
                } else {
                    swal({
                        title: "Error en la tajeta!",
                        text: "No se encontraron resultados!",
                        icon: "warning",
                        button: "Ok!"
                    });
                    $scope.verificacionTarjeta = false;
                    $scope.verificacionTarjetaCompleto = false;
                }
            }
            if (tipoPago === 'credito') {
                if (data.saldo) {
                    $scope.verificacionTarjeta = true;
                    $scope.verificacionTarjetaCompleto = true;
                    $scope.saldo = data.saldo;
                    $scope.end = true;
                    swal({
                        title: "Tarjeta Correcta",
                        text: "El pago se cargara a su tarjeta de credito",
                        icon: "warning",
                        button: "Ok!"
                    });
                } else {
                    swal({
                        title: "Error en la tajeta!",
                        text: "No se encontraron resultados!",
                        icon: "warning",
                        button: "Ok!"
                    });
                }
            }
        });
    };

    $scope.pagar = function () {
        console.log($scope.tipopago);
        console.log($scope.tarjeta);
        console.log($scope.saldo);
        console.log($scope.precio);
        console.log($scope.pedido);
        let nuevoSaldo = Number($scope.saldo) - Number($scope.precio.apartado);
        console.log(nuevoSaldo);
        let params = "?action=finalizarCompra"
                + "&id_usuario=" + $scope.usuario.id_usuario
                + "&tipoCompra=" + $scope.tipopago
                + "&notarjeta=" + $scope.tarjeta
                + "&total=" + $scope.precio.totalFinal
                + "&restante=" + $scope.precio.apartado
                + "&nuevoSaldo=" + nuevoSaldo
                + "&cantidadPlatillos=" + $scope.pedido.length;
        $scope.pedido.forEach((platillo, i) => {
            params += "&idPlatillo" + i + "=" + platillo.id_platillo + "&cantidad" + i + "=" + platillo.CANTIDAD;
        });
        console.log(params);

        $http({
            method: 'POST',
            url: 'compra' + params
        }).then((response, err) => {
            let data = response.data;
            console.log(data);
            swal({
                title: "Compra Finalizada!",
                text: "Total: " + $scope.precio.totalFinal
                        + "\nPagado: " + $scope.precio.apartado
                        + "\nRestante: " + $scope.precio.apartado,
                icon: "success",
                button: "Aceptar"
            });
            $scope.limpiarOrden();
            $scope.cancelar();
            //$scope.verSugerencia();
            //$scope.resetVariables();
            $('#encuesta').modal({
                show: true
            });
        });
    };

    $scope.pagarCompleto = function () {
        console.log($scope.tipopago);
        console.log($scope.tarjeta);
        console.log($scope.saldo);
        console.log($scope.precio);
        console.log($scope.pedido);
        let nuevoSaldo = Number($scope.saldo) - Number($scope.precio.totalFinal);
        console.log(nuevoSaldo);

        let fecha = document.getElementById("fecha").value;
        let hora = document.getElementById("hora").value;
        let dir = $scope.cliente.direccion;
        let direccion = dir.replace('#', '');

        let params = "?action=finalizarCompra"
                + "&id_usuario=" + $scope.usuario.id_usuario
                + "&tipoCompra=" + $scope.tipopago
                + "&notarjeta=" + $scope.tarjeta
                + "&total=" + $scope.precio.totalFinal
                + "&nuevoSaldo=" + nuevoSaldo
                + "&cantidadPlatillos=" + $scope.pedido.length
                + "&restante=0"
                + "&fecha=" + fecha
                + "&hora=" + hora
                + "&direccion=" + direccion
                + "&correo=" + $scope.detailsPedido.correo;
        $scope.pedido.forEach((platillo, i) => {
            params += "&idPlatillo" + i + "=" + platillo.id_platillo + "&cantidad" + i + "=" + platillo.CANTIDAD;
        });
        console.log(params);

        $http({
            method: 'POST',
            url: 'compra' + params
        }).then((response, err) => {
            let data = response.data;
            console.log(data);
            swal({
                title: "Pedido Finalizado!",
                text: "Gracias por odenar con nosotros",
                icon: "success",
                button: "Aceptar"
            });
            $scope.limpiarOrden();
            $scope.cancelar();
            //$scope.verSugerencia();
            //$scope.resetVariables();
        });

        $scope.resetVariables();
    };

    $scope.resetVariables = function () {
        $scope.tipopago = null;
        $scope.tarjeta = null;
        $scope.precio.envio = 0;
        $scope.precio.totalFinal = 0;
    };

    $scope.comprasCliente = 0;

    $scope.clienteFrecuente = function () {
        let params = "?action=frecuente&id_usuario=" + $scope.usuario.id_usuario;
        console.log(params);
        $http({
            method: 'POST',
            url: 'Cliente' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }

            let data = response.data;
            console.log(data);
            $scope.comprasCliente = data;
            $scope.cargarDatos();
        });
    };
    $scope.cliente = [];
    $scope.getCliente = function () {
        let params = "?action=getCliente";
        console.log(params);
        $http({
            method: 'POST',
            url: 'pedido' + params
        }).then((response, err) => {
            if (err) {
                return console.log(err);
            }

            let data = response.data;
            console.log(data);
            $scope.cliente = data;
        });
    };

    $scope.getCliente();
    $scope.limpiarOrden();

    $scope.thisPlatillo = [];

    $scope.details = function (platillo) {
        $scope.thisPlatillo = platillo;
    };

    $scope.validarTarjeta = false;
    $scope.validateDate = function () {
        let fecha = $('#fechaReservacion').val();
        let hora = $('#horaReservacion').val();

        let diffDays = getDiffDays(getDate(), fecha);

        var date = new Date();

        let diffHours = getDiffHour(String(date.getHours()), hora);

        let diffMinutes = getDiffMinutes(String(date.getMinutes()), hora);

        if (diffDays === 0) {
            if (diffHours === 2) {
                if (diffMinutes === 0) {
                    $scope.validarTarjeta = true;
                }
                if (diffMinutes > 0) {
                    $scope.validarTarjeta = true;
                }
                if (diffMinutes < 0) {
                    $scope.validarTarjeta = false;
                }
            } else if (diffHours > 2) {
                $scope.validarTarjeta = true;
            } else {
                $scope.validarTarjeta = false;
            }
        }
        if (diffDays > 0) {
            $scope.validarTarjeta = true;
        }
        function getDate() {
            var x = new Date();
            var y = x.getFullYear().toString();
            var m = (x.getMonth() + 1).toString();
            var d = x.getDate().toString();
            if (m.length === 1) {
                m = '0' + m;
            }
            if (d.length === 1) {
                d = '0' + d;
            }
            var yyyymmdd = y + '-' + m + '-' + d;
            return yyyymmdd;
        }

        function getDiffDays(date1, date2) {
            var nowDate = new Date(date1);
            var dateReservation = new Date(date2);
            var diffDays = dateReservation.getDate() - nowDate.getDate();
            return diffDays;
        }

        function getDiffHour(time1, time2) {
            let h1 = time1.substring(0, 3);
            let h2 = time2.substring(0, 2);
            return Number(h2) - Number(h1);
        }

        function getDiffMinutes(time1, time2) {
            let h1 = time1.substring(0, 3);
            let h2 = time2.substring(3, 5);
            return Number(h2) - Number(h1);
        }

    }

    /**
     * ***************************************************
     * ***************  MODULO LUCY  *********************
     * ***************************************************
     */
});