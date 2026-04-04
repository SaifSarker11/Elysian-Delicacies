package com.fooddelivery.rest;

import com.fooddelivery.model.Coupon;
import com.fooddelivery.service.CouponService;
import com.fooddelivery.util.JsonUtil;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CouponHandler extends BaseHandler {

    private final CouponService couponService = new CouponService();

    @Override
    protected void handleGet(HttpExchange exchange) throws IOException {
        List<Coupon> coupons = couponService.getActiveCoupons();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("coupons", coupons);
        response.put("total", coupons.size());
        sendJson(exchange, response);
    }

    @Override
    protected void handlePost(HttpExchange exchange) throws IOException {
        String[] segments = getPathSegments(exchange);
        if (segments.length > 0 && "validate".equals(segments[0])) {
            String body = readBody(exchange);
            JsonObject json = JsonUtil.parseObject(body);

            String code = json.get("code").getAsString();
            double orderAmount = json.get("orderAmount").getAsDouble();

            Map<String, Object> result = couponService.validateCoupon(code, orderAmount);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.putAll(result);
            sendJson(exchange, response);
        } else {
            sendError(exchange, 400, "Unknown endpoint");
        }
    }
}
