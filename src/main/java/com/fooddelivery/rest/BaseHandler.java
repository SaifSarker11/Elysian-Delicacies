package com.fooddelivery.rest;

import com.fooddelivery.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            String method = exchange.getRequestMethod().toUpperCase();
            switch (method) {
                case "GET" -> handleGet(exchange);
                case "POST" -> handlePost(exchange);
                case "PUT" -> handlePut(exchange);
                case "DELETE" -> handleDelete(exchange);
                default -> sendError(exchange, 405, "Method not allowed");
            }
        } catch (IllegalArgumentException e) {
            sendError(exchange, 400, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            sendError(exchange, 500, "Internal server error: " + e.getMessage());
        }
    }

    protected void handleGet(HttpExchange exchange) throws IOException {
        sendError(exchange, 405, "GET not supported");
    }

    protected void handlePost(HttpExchange exchange) throws IOException {
        sendError(exchange, 405, "POST not supported");
    }

    protected void handlePut(HttpExchange exchange) throws IOException {
        sendError(exchange, 405, "PUT not supported");
    }

    protected void handleDelete(HttpExchange exchange) throws IOException {
        sendError(exchange, 405, "DELETE not supported");
    }

    protected String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            return sb.toString();
        }
    }

    protected void sendResponse(HttpExchange exchange, int statusCode, String jsonResponse) throws IOException {
        byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

    protected void sendJson(HttpExchange exchange, Object data) throws IOException {
        sendResponse(exchange, 200, JsonUtil.toJson(data));
    }

    protected void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        sendResponse(exchange, statusCode, JsonUtil.errorResponse(message));
    }

    protected void sendSuccess(HttpExchange exchange, String message) throws IOException {
        sendResponse(exchange, 200, JsonUtil.successResponse(message));
    }

    protected String[] getPathSegments(HttpExchange exchange) {
        String path = exchange.getRequestURI().getPath();
        String contextPath = exchange.getHttpContext().getPath();
        String remaining = path.substring(contextPath.length());
        if (remaining.startsWith("/"))
            remaining = remaining.substring(1);
        if (remaining.isEmpty())
            return new String[0];
        return remaining.split("/");
    }

    protected Map<String, String> getQueryParams(HttpExchange exchange) {
        Map<String, String> params = new HashMap<>();
        String query = exchange.getRequestURI().getQuery();
        if (query == null || query.isEmpty())
            return params;

        for (String param : query.split("&")) {
            String[] pair = param.split("=", 2);
            String key = URLDecoder.decode(pair[0], StandardCharsets.UTF_8);
            String value = pair.length > 1 ? URLDecoder.decode(pair[1], StandardCharsets.UTF_8) : "";
            params.put(key, value);
        }
        return params;
    }
}
