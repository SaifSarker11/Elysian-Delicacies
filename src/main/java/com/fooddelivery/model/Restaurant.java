package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Restaurant {
    private String id;
    private String ownerId;
    private String name;
    private String description;
    private String cuisineType;
    private Address address;
    private double rating;
    private int totalRatings;
    private String openingTime;
    private String closingTime;
    private boolean isOpen;
    private String imageUrl;
    private double deliveryFee;
    private int estimatedDeliveryMinutes;

    public Restaurant() {
    }

    public Restaurant(String id, String ownerId, String name, String description, String cuisineType, Address address,
            double rating, String openingTime, String closingTime) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.cuisineType = cuisineType;
        this.address = address;
        this.rating = rating;
        this.totalRatings = 0;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isOpen = true;
        this.deliveryFee = 50.0;
        this.estimatedDeliveryMinutes = 30;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCuisineType() {
        return cuisineType;
    }

    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(String closingTime) {
        this.closingTime = closingTime;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public void setOpen(boolean open) {
        isOpen = open;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(double deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public int getEstimatedDeliveryMinutes() {
        return estimatedDeliveryMinutes;
    }

    public void setEstimatedDeliveryMinutes(int estimatedDeliveryMinutes) {
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
    }

    @XmlRootElement(name = "restaurants")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RestaurantList {
        @XmlElement(name = "restaurant")
        private List<Restaurant> restaurants = new ArrayList<>();

        public RestaurantList() {
        }

        public RestaurantList(List<Restaurant> restaurants) {
            this.restaurants = restaurants;
        }

        public List<Restaurant> getRestaurants() {
            return restaurants;
        }

        public void setRestaurants(List<Restaurant> restaurants) {
            this.restaurants = restaurants;
        }
    }
}
