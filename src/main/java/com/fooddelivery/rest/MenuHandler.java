package com.fooddelivery.rest;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.service.MenuService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MenuHandler extends BaseHandler {

    private final MenuService menuService = new MenuService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        Map<String, String> params = getQueryParams(exchange);

        if (segments.length == 0) {
            // Search or get by restaurant
            String restaurantId = params.get("restaurantId");
            String search = params.get("search");

            List<MenuItem> items;
            if (search != null && !search.isEmpty()) {
                items = menuService.searchMenuItems(search);
            } else if (restaurantId != null && !restaurantId.isEmpty()) {
                items = menuService.getMenuByRestaurant(restaurantId);
            } else {
                items = menuService.getAllMenuItems();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("menuItems", items);
            response.put("total", items.size());
            sendJson(exchange, response);
        } else {
            MenuItem item = menuService.getMenuItemById(segments[0]);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("menuItem", item);
            sendJson(exchange, response);
        }
    }

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        MenuItem item = JsonUtil.fromJson(body, MenuItem.class);
        item = menuService.addMenuItem(item);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Menu item added successfully");
        response.put("menuItem", item);
        sendResponse(exchange, 201, JsonUtil.toJson(response));
    }

    @Override
    protected void handlePut(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length == 0) {
            sendError(exchange, 400, "Missing item ID");
            return;
        }

        if (segments.length > 1 && "availability".equals(segments[1])) {
            MenuItem item = menuService.toggleAvailability(segments[0]);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", item.isAvailable() ? "Item is now available" : "Item is now unavailable");
            response.put("menuItem", item);
            sendJson(exchange, response);
            return;
        }

        String body = readBody(exchange);
        MenuItem item = JsonUtil.fromJson(body, MenuItem.class);
        item.setId(segments[0]);
        item = menuService.updateMenuItem(item);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("menuItem", item);
        sendJson(exchange, response);
    }

    @Override
    protected void handleDelete(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length == 0) {
            sendError(exchange, 400, "Missing item ID");
            return;
        }

        boolean deleted = menuService.deleteMenuItem(segments[0]);
        if (deleted) {
            sendSuccess(exchange, "Menu item deleted");
        } else {
            sendError(exchange, 404, "Menu item not found");
        }
    }
}
