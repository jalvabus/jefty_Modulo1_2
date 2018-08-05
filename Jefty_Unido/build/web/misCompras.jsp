<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html ng-app="carritoApp">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Cliente || Compras</title>

        <link href="https://fonts.googleapis.com/css?family=Josefin+Sans|Open+Sans|Raleway" rel="stylesheet">
        <link rel="stylesheet" href="css/flexslider.css">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/font-awesome.min.css">
        <link rel="stylesheet" href="css/style.css">

        <!-- Angular -->
        <script src="js/angular/angular.js"></script>
        <!-- SweetAlert -->
        <script src="js/sweetalert/sweetalert.js"></script>
    </head>
    <body ng-controller="carritoController">

        <!--top header-->
        <header id="home">
            <section class="top-nav hidden-xs">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="top-left">
                                <ul>
                                    <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>                                    
                                    <li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="top-right">
                                <p>Ubicaci&oacute;n:<span>Blvrd Ojo de Agua</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!--main-nav-->
            <div id="main-nav">
                <nav class="navbar">
                    <div class="container">
                        <div class="navbar-header">
                            <a href="Cliente.jsp" class="navbar-brand">Inicio</a>
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#ftheme">
                                <span class="sr-only">Toggle</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                        </div>

                        <div class="navbar-collapse collapse" id="ftheme">
                            <ul class="nav navbar-nav navbar-right">                                
                                <li><a ng-click="logout()">Cerrar Sesion</a></li>                                
                            </ul>
                        </div>                       
                    </div>
                </nav>
            </div>
        </header>

        <!--Login form-->
        <div id="get-touch" ng-if="!showForm">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-sm-4 col-md-6 col-sm-offset-2 col-md-offset-3">
                        <div class="get-touch-heading">
                            <h2>MIS COMPRAS</h2>
                            <p>Aqui esta un listaodo de tus compras.</p>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <div class="container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Venta</th>
                                    <th>Cantidad</th>
                                    <th>Fecha</th>
                                    <th>Subtotal</th>
                                    <th>Detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-if="misCompras.length > 0" ng-repeat="venta in misCompras">
                                    <td>{{venta.id_venta}}</td>
                                    <td>
                                        {{venta.Cantidad}}
                                    </td>
                                    <td>
                                        {{ venta.fecha}}
                                    </td>
                                    <td> $ {{ venta.total}}</td>
                                    <td>
                                        <button data-toggle="modal" data-target=".bd-example-modal-lg" class="btn btn-default" ng-click="detallesVenta(venta)"><i class="fa fa-pencil"></i></button>
                                    </td>
                                </tr>
                                <tr ng-if="misCompras.length === 0">
                                    <td colspan="5">Aun no tiene ninguna compra<td>
                                <tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade bd-example-modal-lg" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title" id="exampleModalCenterTitle">Detalle de la compra</h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-12">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Platillo</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="platillo in compra">
                                            <td><img src="images/platillos/{{platillo.foto}}" style="width: 100px;"></td>
                                            <td>{{ platillo.platillo}}</td>
                                            <td>
                                                {{platillo.cantidad}}
                                            </td>
                                            <td> $ {{ platillo.precio }}</td>
                                            <td> $ {{ platillo.precio * platillo.cantidad}}</td>
                                        </tr>
                                        <tr ng-if="pedido.length === 0">
                                            <td colspan="5">Aun no tiene platillos agregados en su orden, seleccione que desea añadir<td>
                                        <tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <!-- Button trigger modal -->
                        <button ng-if="pedido.length > 0" ng-click="clienteFrecuente()" data-dismiss="modal" type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>


        <!--footer-->
        <div id="footer">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <div class="footer-heading">
                            <h3><span>Nosotros</span></h3>
                            <p>Cocina rica, hecha con mucha ilusión, para gente que le gusta comer y disfrutar cada bocado de la vida... Buscas un sitio íntimo para poder saborear con gusto y conversar de forma relajada. Pensando en ti creamos este espacio.</p>
                            <p>Somos un restaurante que hacemos todo desde el principio y de una forma muy personal, con dedicación y trabajo diario.</p>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="footer-heading">
                            <h3><span>&Uacute;ltimas</span> Novedades</h3>
                            <ul>
                                <li><a>Nuevos platillos</a></li>
                                <li><a>Nuevo equipo de trabajo</a></li>
                                <li><a>Mejoras para ti y tu familia</a></li>
                                <li><a>Pedidos y pagos en línea</a></li>
                                <li><a>Entregas a domicilio</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="footer-heading">
                            <h3><span>Siguenos</span> y Recomiendanos</h3>
                            <div class="insta">
                                <ul>
                                    <img src="images/footer/cen1.jpg" alt="">
                                    <img src="images/footer/comi1.jpg" alt="">
                                    <img src="images/footer/des1.jpg" alt="">
                                    <img src="images/footer/des2.jpg" alt="">
                                    <img src="images/footer/comi2.jpg" alt="">
                                    <img src="images/footer/comi1.png" alt="">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- jQuery -->
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/jquery.flexslider.js"></script>
        <script src="js/jquery.inview.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8HeI8o-c1NppZA-92oYlXakhDPYR7XMY"></script>
        <script src="js/script.js"></script>
        <script src="contactform/contactform.js"></script>

        <script src="js/Modulo1/misCompras.js"></script>
    </body>
</html>
