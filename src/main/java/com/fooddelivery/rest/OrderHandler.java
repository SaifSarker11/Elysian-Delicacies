package com.fooddelivery.rest;

import com.fooddelivery.model.Order;
import com.fooddelivery.service.OrderService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrderHandler extends BaseHandler {

    private final OrderService orderService = new OrderService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        Map<String, String> params = getQueryParams(exchange);

        if (segments.length == 0) {
            String customerId = params.get("customerId");
            String restaurantId = params.get("restaurantId");

            List<Order> orders;
            if (customerId != null && !customerId.isEmpty()) {
                orders = orderService.getOrdersByCustomer(customerId);
            } else if (restaurantId != null && !restaurantId.isEmpty()) {
                orders = orderService.getOrdersByRestaurant(restaurantId);
            } else {
                orders = orderService.getAllOrders();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", orders);
            response.put("total", orders.size());
            sendJson(exchange, response);
        } else {
            Order order = orderService.getOrderById(segments[0]);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            sendJson(exchange, response);
        }
    }

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        Order order = JsonUtil.fromJson(body, Order.class);
        order = orderService.placeOrder(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order placed successfully");
        response.put("order", order);
        sendResponse(exchange, 201, JsonUtil.toJson(response));
    }

    @Override
    protected void handlePut(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length == 0) {
            sendError(exchange, 400, "Missing order ID");
            return;
        }

        String body = readBody(exchange);
        JsonObject json = JsonUtil.parseObject(body);

        if (segments.length > 1 && "status".equals(segments[1])) {
            String newStatus = json.get("status").getAsString();
            Order order = orderService.updateStatus(segments[0], newStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order status updated to " + newStatus);
            response.put("order", order);
            sendJson(exchange, response);
            return;
        }

        if (segments.length > 1 && "rider".equals(segments[1])) {
            String riderId = json.get("riderId").getAsString();
            Order order = orderService.assignRider(segments[0], riderId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rider assigned successfully");
            response.put("order", order);
            sendJson(exchange, response);
            return;
        }

        sendError(exchange, 400, "Invalid operation");
    }
}
