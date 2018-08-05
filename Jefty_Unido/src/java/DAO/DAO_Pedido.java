/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import Connection.DB_Manager;
import java.sql.Connection;
import Model.*;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.awt.Desktop;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 *
 * @author juana
 */
public class DAO_Pedido {

    DB_Manager db_manager;
    Connection connection;

    public DAO_Pedido() {
        db_manager = new DB_Manager();
        connection = db_manager.getConnection();
    }

    public boolean sendEmail(String correo, int idVenta) {
        boolean enviado = false;
        try {

            String host = "smtp.gmail.com";

            Properties prop = System.getProperties();
            prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
            prop.put("mail.smtp.starttls.enable", "true");
            prop.put("mail.smtp.host", host);
            prop.put("mail.smtp.user", "lucytaniaRuzLT@gmail.com");
            prop.put("mail.smtp.password", "LucytaniaLT");
            prop.put("mail.smtp.port", 587);
            prop.put("mail.smtp.auth", "true");

            Session sesion = Session.getDefaultInstance(prop, null);

            MimeMessage message = new MimeMessage(sesion);

            message.setFrom(new InternetAddress("lucytaniaRuzLT@gmail.com"));

            message.setRecipient(Message.RecipientType.TO, new InternetAddress(correo));

            message.setSubject("Pedido || DetallePedido");
            message.setText(null, "utf-8", "html");

            /**
             * Agregar archivo PDF
             */
            // JavaMail 1.3
            Multipart multipart = new MimeMultipart();
            // JavaMail 1.4
            MimeBodyPart attachPart = new MimeBodyPart();
            String attachFile = "C:/reportes/detallePedido" + idVenta + ".pdf";
            attachPart.attachFile(attachFile);
            multipart.addBodyPart(attachPart);
            message.setContent(multipart);

            Transport transport = sesion.getTransport("smtp");

            transport.connect(host, "lucytaniaRuzLT@gmail.com", "LucytaniaLT");

            transport.sendMessage(message, message.getAllRecipients());

            transport.close();

            enviado = true;

        } catch (Exception e) {
            System.out.println("Error sending mail : " + e);
        }

        return enviado;
    }

    public void reporteCompra(int idVenta, String fecha, String hora, String direccion, String usuario) {
        try {
            Document documento = new Document();

            String ruta = "C:\\reportes";
            String nombre = "detallePedido" + idVenta;

            PdfWriter writer = PdfWriter.getInstance(documento, new FileOutputStream(ruta + "\\" + nombre + ".pdf"));

            documento.open();

            //Este es el nombre de la cabecera
            documento.add(new Paragraph("\t \t \n TICKET DE PEDIDO " + idVenta, FontFactory.getFont("arial", 15, Font.BOLD, BaseColor.BLACK)));
            documento.add(new Paragraph("DETALLE DE PEDIDO DE PLATILLOS", FontFactory.getFont("arial", 15, Font.BOLD, BaseColor.BLACK)));
            documento.add(new Paragraph("\t \t \n Gracias " + usuario + " por comprar con nostros, aqui tienes el detalle de tu PEDIDO \n \n", FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK)));

            PdfPTable tabla;
            tabla = new PdfPTable(5);
            tabla.setWidthPercentage(100);

            PdfPCell celda1 = new PdfPCell(new Paragraph("Platillo", FontFactory.getFont("arial", 10, Font.BOLD, BaseColor.RED)));
            PdfPCell celda2 = new PdfPCell(new Paragraph("Descripcion", FontFactory.getFont("arial", 10, Font.BOLD, BaseColor.RED)));
            PdfPCell celda3 = new PdfPCell(new Paragraph("Cantidad", FontFactory.getFont("arial", 10, Font.BOLD, BaseColor.RED)));
            PdfPCell celda4 = new PdfPCell(new Paragraph("Precio", FontFactory.getFont("arial", 10, Font.BOLD, BaseColor.RED)));
            PdfPCell celda5 = new PdfPCell(new Paragraph("Subtotal", FontFactory.getFont("arial", 10, Font.BOLD, BaseColor.RED)));

            tabla.addCell(celda1);
            tabla.addCell(celda2);
            tabla.addCell(celda3);
            tabla.addCell(celda4);
            tabla.addCell(celda5);

            String SQL = "select * from ventaplatillos vp "
                    + "inner join detalleventaplatillo dvp on vp.id_ventaPlatillo = dvp.id_ventaPlatillo "
                    + "inner join platillo p on dvp.id_platillo = p.id_platillo "
                    + "where vp.id_ventaPlatillo = '" + idVenta + "';";

            float total = 0;
            float tot = 0;
            float subtotal = 0;
            try {
                DB_Manager db_manager = new DB_Manager();
                Connection connection = db_manager.getConnection();
                PreparedStatement ps = connection.prepareCall(SQL);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Float sb = rs.getFloat(11) * rs.getFloat(16);
                    tabla.addCell(new PdfPCell(new Paragraph(rs.getString(13), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK))));
                    tabla.addCell(new PdfPCell(new Paragraph(rs.getString(14), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK))));
                    tabla.addCell(new PdfPCell(new Paragraph(rs.getString(11), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK))));
                    tabla.addCell(new PdfPCell(new Paragraph(rs.getString(16), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK))));
                    tabla.addCell(new PdfPCell(new Paragraph(String.valueOf(sb), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK))));
                    subtotal += sb;
                    total = rs.getFloat(4);
                }
            } catch (Exception e) {
            }

            // Adding Table to document        
            documento.add(tabla);

            documento.add(new Paragraph("\n \n", FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK)));
            int envio = 0;
            if (subtotal < 300) {
                envio = 50;
            }
            tot = subtotal + envio;
            float iva = (float) (tot * 0.16);

            documento.add(new Paragraph("\t \t Direccion de envio: " + direccion + " hrs ", FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK)));

            documento.add(new Paragraph("\t \t Total: $ " + String.valueOf(total), FontFactory.getFont("arial", 10, Font.NORMAL, BaseColor.BLACK)));

            // Closing the document       
            documento.close();

            mostrarReporte(ruta, nombre);
        } catch (DocumentException ex) {
            System.out.println("Error Document Exception " + ex);
        } catch (FileNotFoundException exs) {
            System.out.println("Error File not found " + exs);
        }
    }

    public void mostrarReporte(String ruta, String nombre) {
        try {
            File abrir = new File(ruta + "\\" + nombre + ".pdf");
            Desktop.getDesktop().open(abrir);
        } catch (IOException e) {
        }
    }

    public int createPedido(String fecha, String hora, String direccion, int id_usuario, int cantidadPlatillos) {
        try {
            String SQL = "INSERT into pedido values(null, '" + fecha + "', '" + hora + "', '" + direccion + "', '" + id_usuario + "', '" + cantidadPlatillos + "');";
            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            String query = "select MAX(id_pedido) from pedido ";
            PreparedStatement id = connection.prepareCall(query);
            ResultSet cdr = id.executeQuery();
            if (cdr.next()) {
                return cdr.getInt(1);
            } else {
                return 0;
            }
        } catch (Exception e) {
            System.out.println("Error DAO_Pedido > createPedido : " + e);
            return 0;
        }
    }

    public boolean createDetallePedido(int idPedido, String cantidad, String idPlatillo) {
        try {
            String SQL = "INSERT into detpedido values(null, '" + idPedido + "', '" + cantidad + "', '" + idPlatillo + "');";
            System.out.println(SQL);
            PreparedStatement ps = connection.prepareCall(SQL);
            ps.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Error DAO_Pedido > creteDetallePedido: " + e);
            return false;
        }
    }
}
