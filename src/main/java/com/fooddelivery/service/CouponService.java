package com.fooddelivery.service;

import com.fooddelivery.model.Coupon;
import com.fooddelivery.storage.XmlDataStore;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CouponService {

    private final XmlDataStore dataStore;

    public CouponService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public Map<String, Object> validateCoupon(String code, double orderAmount) {
        Coupon coupon = dataStore.getCouponByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code: " + code));

        if (!coupon.isActive()) {
            throw new IllegalArgumentException("Coupon is no longer active");
        }

        if (orderAmount < coupon.getMinOrderAmount()) {
            throw new IllegalArgumentException("Minimum order amount is " + coupon.getMinOrderAmount());
        }

        double discount = coupon.calculateDiscount(orderAmount);

        Map<String, Object> result = new HashMap<>();
        result.put("code", coupon.getCode());
        result.put("description", coupon.getDescription());
        result.put("discountPercent", coupon.getDiscountPercent());
        result.put("discount", discount);
        result.put("originalAmount", orderAmount);
        result.put("finalAmount", orderAmount - discount);
        result.put("valid", true);

        return result;
    }

    public List<Coupon> getActiveCoupons() {
        return dataStore.getActiveCoupons();
    }

    public List<Coupon> getAllCoupons() {
        return dataStore.getAllCoupons();
    }
}
