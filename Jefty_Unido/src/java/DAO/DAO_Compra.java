package DAO;

import Connection.DB_Manager;
import Model.Compras;
import Model.Detalle_Venta;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class DAO_Compra {

    DB_Manager db_manager;
    Connection connection;

    public DAO_Compra() {
        db_manager = new DB_Manager();
        connection = db_manager.getConnection();
    }

    public int createVenta(String id_usuario, int cantidad, String tipoPago, float total, float restante) {
        try {
            String SQL = "INSERT into ventaPlatillos values(null, '" + id_usuario + "', '" + cantidad + "', '" + total + "', now(), '" + tipoPago + "', '" + restante + "');";
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            String query = "select MAX(id_ventaPlatillo) from ventaPlatillos ";
            PreparedStatement id = connection.prepareCall(query);
            ResultSet cdr = id.executeQuery();
            if (cdr.next()) {
                return cdr.getInt(1);
            } else {
                return 0;
            }
        } catch (Exception e) {
            System.out.println("Error DAO_Compra > createVenta : " + e);
            return 0;
        }
    }

    public boolean createDetalleVenta(int idVenta, int id_platillo, int cantidad) {
        try {
            String SQL = "INSERT INTO detalleVentaPlatillo values (null, '" + idVenta + "', '" + id_platillo + "', '" + cantidad + "');";
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Error DAO_Compra > creteDetalleVenta : " + e);
            return false;
        }
    }

    public boolean actualizarSaldoTarjeta(String noTarjeta, String tipo, float saldo) {
        try {
            String SQL = null;
            if (tipo.equalsIgnoreCase("credito")) {
                SQL = "update tarjetacredito set saldo = '" + saldo + "' where id_tarjetacredito = '" + noTarjeta + "';";
            } else {
                SQL = "update tarjetaprepago set saldo = '" + saldo + "' where id_tarjetaPrepago = '" + noTarjeta + "';";
            }

            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Error DAO_Compra > actualizarSaldoTarjeta : " + e);
            return false;
        }
    }

    public boolean registrarEncuesta(String p1, String p2, String p3, String p4, String p5) {
        String SQL = "insert into encuesta values (null, \n"
                + "'Encuesta de Cliente', \n"
                + "'¿Encontro lo que buscaba?', '" + p1 + "', \n"
                + "'¿Alguna sugerencia de platillos?','" + p2 + "', \n"
                + "'¿Recomendaria el sitio web?', '" + p3 + "',\n"
                + "'¿Como le parecio el servicio?', '" + p4 + "',\n"
                + "'¿Que opina del lugar?' ,'" + p5 + "');";
        try {
            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Eror DAO_Compra > registrarEncuesta : " + e);
            return false;
        }
    }

    public int insertPago(String total, String tipo_tarjeta, String id_tarjeta) {
        try {
            String SQL = "INSERT into pagos values (null, '" + total + "','" + tipo_tarjeta + "','" + id_tarjeta + "');";
            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();

            String id = "Select max(id_pago) from pagos;";
            PreparedStatement getID = connection.prepareCall(id);
            ResultSet rs = getID.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            } else {
                return 0;
            }
        } catch (Exception e) {
            System.out.println("Eror DAO_Compra > insertPago : " + e);
            return 0;
        }
    }

    public boolean insertPaquete(String costo, int pago, int id_cliente, int id_paqueteFK) {
        try {
            String SQL = "INSERT into paquete values (null, '" + costo + "', '" + pago + "', '" + id_cliente + "', '" + id_paqueteFK + "');";
            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Eror DAO_Compra > insertPago : " + e);
            return false;
        }
    }
    
    /**
     * Lucy
     */
    public ArrayList<Compras> getMisCompras(String id_usuario) {
        ArrayList<Compras> compras = new ArrayList<>();
        try {
            String query = "select * from ventaplatillos where id_usuario ='" + id_usuario + "' ";
            System.out.println(query);
            PreparedStatement id = connection.prepareCall(query);
            ResultSet rs = id.executeQuery();
            while (rs.next()) {
                Compras compra = new Compras();
                compra.setId_venta(rs.getString(1));
                compra.setId_usuario(Integer.parseInt(id_usuario));
                compra.setCantidad(rs.getInt(3));
                compra.setTotal(rs.getFloat(4));
                compra.setFecha(rs.getString(5));
                compra.setTipoPago(rs.getString(6));
                compra.setRestante(rs.getString(7));
                compras.add(compra);
            }
        } catch (Exception e) {
            System.out.println("Eror DAO_Compra > getMisCompras : " + e);
        }
        return compras;
    }

    public ArrayList<Detalle_Venta> getDetalleVenta(String idCompra, String usuario) {
        ArrayList<Detalle_Venta> detalles = new ArrayList<>();
        try {
            String query = "select * from ventaplatillos vp\n"
                    + "inner join detalleventaplatillo dvp on vp.id_ventaPlatillo = dvp.id_ventaPlatillo\n"
                    + "inner join platillo p on dvp.id_platillo = p.id_platillo \n"
                    + "where vp.id_usuario = " + usuario + " and vp.id_ventaPlatillo = " + idCompra + ";";
            PreparedStatement id = connection.prepareCall(query);
            ResultSet rs = id.executeQuery();
            while (rs.next()) {
                Detalle_Venta detalle = new Detalle_Venta();
                detalle.setId_detalleVenta(rs.getInt(8));
                detalle.setId_venta(Integer.parseInt(idCompra));
                detalle.setCantidad(rs.getString(11));
                detalle.setPlatillo(rs.getString(13));
                detalle.setPrecio(rs.getFloat(16));
                detalle.setFoto(rs.getString(15));
                detalles.add(detalle);
            }
        } catch (Exception e) {
            System.out.println("Eror DAO_Compra > getDetalleVenta : " + e);
        }
        return detalles;
    }
}
