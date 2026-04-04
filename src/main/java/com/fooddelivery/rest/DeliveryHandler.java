package com.fooddelivery.rest;

import com.fooddelivery.model.DeliveryRider;
import com.fooddelivery.service.DeliveryService;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DeliveryHandler extends BaseHandler {

    private final DeliveryService deliveryService = new DeliveryService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        Map<String, String> params = getQueryParams(exchange);

        if (segments.length == 0) {
            sendError(exchange, 400, "Missing endpoint (riders or estimate)");
            return;
        }

        switch (segments[0]) {
            case "riders" -> {
                String area = params.get("area");
                List<DeliveryRider> riders = deliveryService.getAvailableRiders(area);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("riders", riders);
                response.put("total", riders.size());
                sendJson(exchange, response);
            }
            case "estimate" -> {
                String restaurantId = params.get("restaurantId");
                double lat = Double.parseDouble(params.getOrDefault("lat", "23.7925"));
                double lon = Double.parseDouble(params.getOrDefault("lon", "90.4078"));

                Map<String, Object> estimate = deliveryService.getDeliveryEstimate(restaurantId, lat, lon);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.putAll(estimate);
                sendJson(exchange, response);
            }
            default -> sendError(exchange, 404, "Unknown endpoint: " + segments[0]);
        }
    }
}
