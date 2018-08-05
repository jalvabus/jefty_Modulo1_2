package Services;

import Model.Usuario;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import Model.*;
import DAO.*;
import com.google.gson.Gson;
import javax.servlet.http.HttpSession;

@WebServlet(name = "compra", urlPatterns = {"/compra"})
public class compra extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");

        DAO_Compra $compra = new DAO_Compra();
        DAO_Cliente $cliente = new DAO_Cliente();
        DAO_Pedido $pedido = new DAO_Pedido();

        Gson gson = new Gson();

        HttpSession sesion = request.getSession();
        Usuario userSesion = (Usuario) sesion.getAttribute("user");

        if (action.equalsIgnoreCase("finalizarCompra")) {

            String id_usuario = request.getParameter("id_usuario");
            String tipoTarjeta = request.getParameter("tipoCompra");
            String noTarjeta = request.getParameter("notarjeta");
            Float total = Float.parseFloat(request.getParameter("total"));
            Float nuevoSaldo = Float.parseFloat(request.getParameter("nuevoSaldo"));
            int cantidadPlatillos = Integer.parseInt(request.getParameter("cantidadPlatillos"));
            float restante = Float.parseFloat(request.getParameter("restante"));
            String fecha = request.getParameter("fecha");
            String hora = request.getParameter("hora");
            String direccion = request.getParameter("direccion");
            
            String correo = request.getParameter("correo");

            int puntosCliente = $cliente.getPuntosCliente(Integer.parseInt(id_usuario));
            int puntosCompra = (int) (total / 10);

            $cliente.sumaPuntosCliente(Integer.parseInt(id_usuario), puntosCompra);

            $compra.actualizarSaldoTarjeta(noTarjeta, tipoTarjeta, nuevoSaldo);

            $compra.insertPago(String.valueOf(total), tipoTarjeta, noTarjeta);
            $cliente.createClienteFrecuente(Integer.parseInt(id_usuario));

            Model.Cliente client = $cliente.getCliente(String.valueOf(userSesion.getId_usuario()));

            int idVenta = $compra.createVenta(id_usuario, cantidadPlatillos, tipoTarjeta, total, restante);
            int idPedido = $pedido.createPedido(fecha, hora, direccion, client.getId_cliente(), cantidadPlatillos);

            for (int i = 0; i < cantidadPlatillos; i++) {
                String paramID = "idPlatillo" + String.valueOf(i);
                System.out.println("Id_Platilo: " + request.getParameter(paramID));
                String paramCant = "cantidad" + String.valueOf(i);
                System.out.println("Cantidad: " + request.getParameter(paramCant));
                $compra.createDetalleVenta(idVenta, Integer.parseInt(request.getParameter(paramID)), Integer.parseInt(request.getParameter(paramCant)));
                $pedido.createDetallePedido(idPedido, request.getParameter(paramCant), request.getParameter(paramID));
            }
            
            $pedido.reporteCompra(idVenta, fecha, hora, direccion, userSesion.getNombre());
            $pedido.sendEmail(correo, idVenta);
            
            out.println("OK");
        }

        if (action.equalsIgnoreCase("encuesta")) {
            String p1 = request.getParameter("p1");
            String p2 = request.getParameter("p2");
            String p3 = request.getParameter("p3");
            String p4 = request.getParameter("p4");
            String p5 = request.getParameter("p5");
            $compra.registrarEncuesta(p1, p2, p3, p4, p5);
        }

        if (action.equalsIgnoreCase("getMisCompras")) {
            String compras = gson.toJson($compra.getMisCompras(String.valueOf(userSesion.getId_usuario())));
            out.println(compras);
        }

        if (action.equalsIgnoreCase("getDetalleCompra")) {
            String idVenta = request.getParameter("id_venta");
            String compras = gson.toJson($compra.getDetalleVenta(idVenta, String.valueOf(userSesion.getId_usuario())));
            out.println(compras);
        }
    }
}
