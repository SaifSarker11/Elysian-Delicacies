package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Coupon {
    private String code;
    private String description;
    private double discountPercent;
    private double maxDiscount;
    private double minOrderAmount;
    private String validUntil;
    private boolean active;

    public Coupon() {
    }

    public Coupon(String code, String description, double discountPercent,
            double maxDiscount, double minOrderAmount, String validUntil) {
        this.code = code;
        this.description = description;
        this.discountPercent = discountPercent;
        this.maxDiscount = maxDiscount;
        this.minOrderAmount = minOrderAmount;
        this.validUntil = validUntil;
        this.active = true;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public double getMaxDiscount() {
        return maxDiscount;
    }

    public void setMaxDiscount(double maxDiscount) {
        this.maxDiscount = maxDiscount;
    }

    public double getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(double minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public String getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(String validUntil) {
        this.validUntil = validUntil;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public double calculateDiscount(double orderAmount) {
        if (!active || orderAmount < minOrderAmount)
            return 0;
        double discount = orderAmount * (discountPercent / 100.0);
        return Math.min(discount, maxDiscount);
    }

    @XmlRootElement(name = "coupons")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class CouponList {
        @XmlElement(name = "coupon")
        private List<Coupon> coupons = new ArrayList<>();

        public CouponList() {
        }

        public CouponList(List<Coupon> coupons) {
            this.coupons = coupons;
        }

        public List<Coupon> getCoupons() {
            return coupons;
        }

        public void setCoupons(List<Coupon> coupons) {
            this.coupons = coupons;
        }
    }
}
