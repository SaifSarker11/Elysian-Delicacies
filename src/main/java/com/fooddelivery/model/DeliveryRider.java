package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class DeliveryRider {
    private String id;
    private String userId;
    private String name;
    private String phone;
    private String vehicleType;
    private boolean available;
    private String currentArea;
    private double rating;

    public DeliveryRider() {
    }

    public DeliveryRider(String id, String userId, String name, String phone,
            String vehicleType, boolean available, String currentArea) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.vehicleType = vehicleType;
        this.available = available;
        this.currentArea = currentArea;
        this.rating = 4.5;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getCurrentArea() {
        return currentArea;
    }

    public void setCurrentArea(String currentArea) {
        this.currentArea = currentArea;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    @XmlRootElement(name = "riders")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RiderList {
        @XmlElement(name = "rider")
        private List<DeliveryRider> riders = new ArrayList<>();

        public RiderList() {
        }

        public RiderList(List<DeliveryRider> riders) {
            this.riders = riders;
        }

        public List<DeliveryRider> getRiders() {
            return riders;
        }

        public void setRiders(List<DeliveryRider> riders) {
            this.riders = riders;
        }
    }
}
