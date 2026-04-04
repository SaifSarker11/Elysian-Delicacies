package com.fooddelivery.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.net.URLConnection;
import java.nio.file.*;

public class StaticFileHandler implements HttpHandler {

    private final String basePath;

    public StaticFileHandler(String basePath) {
        this.basePath = basePath;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String requestPath = exchange.getRequestURI().getPath();

        if (requestPath.startsWith("/")) {
            requestPath = requestPath.substring(1);
        }

        if (requestPath.isEmpty() || requestPath.equals("/")) {
            requestPath = "index.html";
        }

        Path filePath = Paths.get(basePath, requestPath);

        if (!Files.exists(filePath) || Files.isDirectory(filePath)) {
            filePath = Paths.get(basePath, "index.html");
        }

        if (!Files.exists(filePath)) {
            String notFound = "<!DOCTYPE html><html><body><h1>404 Not Found</h1></body></html>";
            exchange.getResponseHeaders().set("Content-Type", "text/html");
            byte[] bytes = notFound.getBytes();
            exchange.sendResponseHeaders(404, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
            return;
        }

        String contentType = getContentType(filePath.toString());
        exchange.getResponseHeaders().set("Content-Type", contentType);

        byte[] fileBytes = Files.readAllBytes(filePath);
        exchange.sendResponseHeaders(200, fileBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(fileBytes);
        }
    }

    private String getContentType(String path) {
        if (path.endsWith(".html"))
            return "text/html; charset=UTF-8";
        if (path.endsWith(".css"))
            return "text/css; charset=UTF-8";
        if (path.endsWith(".js"))
            return "application/javascript; charset=UTF-8";
        if (path.endsWith(".json"))
            return "application/json; charset=UTF-8";
        if (path.endsWith(".png"))
            return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg"))
            return "image/jpeg";
        if (path.endsWith(".gif"))
            return "image/gif";
        if (path.endsWith(".svg"))
            return "image/svg+xml";
        if (path.endsWith(".ico"))
            return "image/x-icon";
        if (path.endsWith(".woff"))
            return "font/woff";
        if (path.endsWith(".woff2"))
            return "font/woff2";
        if (path.endsWith(".ttf"))
            return "font/ttf";

        String mimeType = URLConnection.guessContentTypeFromName(path);
        return mimeType != null ? mimeType : "application/octet-stream";
    }
}
