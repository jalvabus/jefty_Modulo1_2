/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Services;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import Model.*;
import DAO.*;

/**
 *
 * @author juana
 */
@WebServlet(name = "pedido", urlPatterns = {"/pedido"})
public class pedido extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String action = request.getParameter("action");
        
        Gson gson = new Gson();
        
        if (action.equalsIgnoreCase("getCliente")) {
            
            HttpSession sesion = request.getSession();
            Usuario userSesion = (Usuario) sesion.getAttribute("user");
            
            DAO_Cliente $cliente = new DAO_Cliente();
            out.println(gson.toJson($cliente.getCliente(String.valueOf(userSesion.getId_usuario()))));
        }
    }
    
}
