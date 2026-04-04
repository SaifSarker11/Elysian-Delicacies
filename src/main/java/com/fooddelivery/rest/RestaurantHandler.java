package com.fooddelivery.rest;

import com.fooddelivery.model.Address;
import com.fooddelivery.model.Restaurant;
import com.fooddelivery.service.RestaurantService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RestaurantHandler extends BaseHandler {

    private final RestaurantService restaurantService = new RestaurantService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        Map<String, String> params = getQueryParams(exchange);

        if (segments.length == 0) {
            String area = params.get("area");
            String cuisine = params.get("cuisine");
            String sortBy = params.get("sortBy");
            String search = params.get("search");
            String ownerId = params.get("ownerId");

            List<Restaurant> restaurants;
            if (ownerId != null && !ownerId.isEmpty()) {
                restaurants = restaurantService.getRestaurantsByOwner(ownerId);
            } else {
                restaurants = restaurantService.getRestaurants(area, cuisine, sortBy, search);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("restaurants", restaurants);
            response.put("total", restaurants.size());
            sendJson(exchange, response);
        } else {
            Restaurant restaurant = restaurantService.getRestaurantById(segments[0]);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("restaurant", restaurant);
            sendJson(exchange, response);
        }
    }

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        Restaurant restaurant = JsonUtil.fromJson(body, Restaurant.class);
        restaurant = restaurantService.registerRestaurant(restaurant);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Restaurant registered successfully");
        response.put("restaurant", restaurant);
        sendResponse(exchange, 201, JsonUtil.toJson(response));
    }

    @Override
    protected void handlePut(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length == 0) {
            sendError(exchange, 400, "Missing restaurant ID");
            return;
        }

        String body = readBody(exchange);

        if (segments.length > 1 && "status".equals(segments[1])) {
            Restaurant restaurant = restaurantService.toggleStatus(segments[0]);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", restaurant.isOpen() ? "Restaurant is now open" : "Restaurant is now closed");
            response.put("restaurant", restaurant);
            sendJson(exchange, response);
            return;
        }

        Restaurant restaurant = JsonUtil.fromJson(body, Restaurant.class);
        restaurant.setId(segments[0]);
        restaurant = restaurantService.updateRestaurant(restaurant);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("restaurant", restaurant);
        sendJson(exchange, response);
    }
}
