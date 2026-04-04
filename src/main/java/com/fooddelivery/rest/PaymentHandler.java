package com.fooddelivery.rest;

import com.fooddelivery.model.Payment;
import com.fooddelivery.service.PaymentService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class PaymentHandler extends BaseHandler {

    private final PaymentService paymentService = new PaymentService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length == 0) {
            sendError(exchange, 400, "Missing order ID");
            return;
        }

        Payment payment = paymentService.getPaymentByOrderId(segments[0]);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("payment", payment);
        sendJson(exchange, response);
    }

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String body = readBody(exchange);
        JsonObject json = JsonUtil.parseObject(body);

        String orderId = json.get("orderId").getAsString();
        double amount = json.get("amount").getAsDouble();
        String method = json.has("method") ? json.get("method").getAsString() : "CASH";

        Payment payment = paymentService.processPayment(orderId, amount, method);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment processed successfully");
        response.put("payment", payment);
        sendResponse(exchange, 201, JsonUtil.toJson(response));
    }
}
