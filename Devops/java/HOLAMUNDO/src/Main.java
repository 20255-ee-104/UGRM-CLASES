import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class Main {
    public static void main(String[] args) throws IOException {
        // Crear un servidor HTTP que escuche en el puerto 80
        HttpServer server = HttpServer.create(new InetSocketAddress(80), 0);

        // Configurar una ruta para la raíz "/"
        server.createContext("/", exchange -> {
            String response = "¡Hola Mundo desde Java!";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            exchange.getResponseBody().write(response.getBytes());
            exchange.getResponseBody().close();
        });

        // Iniciar el servidor
        System.out.println("Servidor iniciado en el puerto 80...");
        server.start();
    }
}
