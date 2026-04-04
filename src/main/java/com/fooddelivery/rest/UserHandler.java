package com.fooddelivery.rest;

import com.fooddelivery.model.Address;
import com.fooddelivery.model.User;
import com.fooddelivery.service.UserService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class UserHandler extends BaseHandler {

    private final UserService userService = new UserService();

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        String body = readBody(exchange);

        if (segments.length == 0) {
            sendError(exchange, 400, "Missing endpoint");
            return;
        }

        switch (segments[0]) {
            case "register" -> handleRegister(exchange, body);
            case "login" -> handleLogin(exchange, body);
            default -> sendError(exchange, 404, "Unknown endpoint: " + segments[0]);
        }
    }

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length > 0) {
            User user = userService.getUserById(segments[0]);
            Map<String, Object> userMap = userToMap(user);
            sendJson(exchange, userMap);
        } else {
            sendError(exchange, 400, "Missing user ID");
        }
    }

    private void handleRegister(HttpExchange exchange, String body) throws IOException {
        JsonObject json = JsonUtil.parseObject(body);

        String name = json.get("name").getAsString();
        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();
        String phone = json.has("phone") ? json.get("phone").getAsString() : "";
        String role = json.has("role") ? json.get("role").getAsString() : "CUSTOMER";

        Address address = null;
        if (json.has("address")) {
            JsonObject addr = json.getAsJsonObject("address");
            address = new Address(
                    addr.has("area") ? addr.get("area").getAsString() : "",
                    addr.has("street") ? addr.get("street").getAsString() : "",
                    addr.has("city") ? addr.get("city").getAsString() : "",
                    addr.has("latitude") ? addr.get("latitude").getAsDouble() : 0,
                    addr.has("longitude") ? addr.get("longitude").getAsDouble() : 0);
        }

        User user = userService.register(name, email, password, phone, role, address);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", userToMap(user));
        sendResponse(exchange, 201, JsonUtil.toJson(response));
    }

    private void handleLogin(HttpExchange exchange, String body) throws IOException {
        JsonObject json = JsonUtil.parseObject(body);
        String email = json.get("email").getAsString();
        String password = json.get("password").getAsString();

        User user = userService.login(email, password);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", userToMap(user));
        sendJson(exchange, response);
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("role", user.getRole().name());
        map.put("address", user.getAddress());
        return map;
    }
}
