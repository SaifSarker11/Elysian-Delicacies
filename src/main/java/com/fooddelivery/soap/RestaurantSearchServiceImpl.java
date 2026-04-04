package com.fooddelivery.soap;

import com.fooddelivery.model.Restaurant;
import com.fooddelivery.service.RestaurantService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@WebService(serviceName = "RestaurantSearchService")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public class RestaurantSearchServiceImpl {

    private final RestaurantService restaurantService = new RestaurantService();

    @WebMethod
    public RestaurantSearchResult searchByArea(@WebParam(name = "area") String area) {
        List<Restaurant> restaurants = restaurantService.searchByArea(area);
        RestaurantSearchResult result = new RestaurantSearchResult();
        result.setArea(area);
        result.setTotalResults(restaurants.size());

        List<RestaurantInfo> infos = new ArrayList<>();
        for (Restaurant r : restaurants) {
            RestaurantInfo info = new RestaurantInfo();
            info.setId(r.getId());
            info.setName(r.getName());
            info.setDescription(r.getDescription());
            info.setCuisineType(r.getCuisineType());
            info.setRating(r.getRating());
            info.setDeliveryFee(r.getDeliveryFee());
            info.setEstimatedDeliveryMinutes(r.getEstimatedDeliveryMinutes());
            info.setOpen(r.isOpen());
            info.setAddress(r.getAddress() != null ? r.getAddress().toString() : "N/A");
            info.setOpeningTime(r.getOpeningTime());
            info.setClosingTime(r.getClosingTime());
            infos.add(info);
        }
        result.setRestaurants(infos);
        return result;
    }

    @WebMethod
    public RestaurantSearchResult searchByCuisine(@WebParam(name = "cuisineType") String cuisineType) {
        List<Restaurant> restaurants = restaurantService.searchByCuisine(cuisineType);
        RestaurantSearchResult result = new RestaurantSearchResult();
        result.setArea("All Areas");
        result.setTotalResults(restaurants.size());

        List<RestaurantInfo> infos = new ArrayList<>();
        for (Restaurant r : restaurants) {
            RestaurantInfo info = new RestaurantInfo();
            info.setId(r.getId());
            info.setName(r.getName());
            info.setDescription(r.getDescription());
            info.setCuisineType(r.getCuisineType());
            info.setRating(r.getRating());
            info.setDeliveryFee(r.getDeliveryFee());
            info.setEstimatedDeliveryMinutes(r.getEstimatedDeliveryMinutes());
            info.setOpen(r.isOpen());
            info.setAddress(r.getAddress() != null ? r.getAddress().toString() : "N/A");
            infos.add(info);
        }
        result.setRestaurants(infos);
        return result;
    }

    @WebMethod
    public RestaurantInfo getRestaurantDetails(@WebParam(name = "restaurantId") String restaurantId) {
        try {
            Restaurant r = restaurantService.getRestaurantById(restaurantId);
            RestaurantInfo info = new RestaurantInfo();
            info.setId(r.getId());
            info.setName(r.getName());
            info.setDescription(r.getDescription());
            info.setCuisineType(r.getCuisineType());
            info.setRating(r.getRating());
            info.setDeliveryFee(r.getDeliveryFee());
            info.setEstimatedDeliveryMinutes(r.getEstimatedDeliveryMinutes());
            info.setOpen(r.isOpen());
            info.setAddress(r.getAddress() != null ? r.getAddress().toString() : "N/A");
            info.setOpeningTime(r.getOpeningTime());
            info.setClosingTime(r.getClosingTime());
            return info;
        } catch (Exception e) {
            return null;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RestaurantSearchResult {
        private String area;
        private int totalResults;
        @XmlElementWrapper(name = "restaurants")
        @XmlElement(name = "restaurant")
        private List<RestaurantInfo> restaurants = new ArrayList<>();

        public String getArea() {
            return area;
        }

        public void setArea(String area) {
            this.area = area;
        }

        public int getTotalResults() {
            return totalResults;
        }

        public void setTotalResults(int totalResults) {
            this.totalResults = totalResults;
        }

        public List<RestaurantInfo> getRestaurants() {
            return restaurants;
        }

        public void setRestaurants(List<RestaurantInfo> restaurants) {
            this.restaurants = restaurants;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RestaurantInfo {
        private String id;
        private String name;
        private String description;
        private String cuisineType;
        private double rating;
        private double deliveryFee;
        private int estimatedDeliveryMinutes;
        private boolean isOpen;
        private String address;
        private String openingTime;
        private String closingTime;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
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

        public double getRating() {
            return rating;
        }

        public void setRating(double rating) {
            this.rating = rating;
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

        public void setEstimatedDeliveryMinutes(int m) {
            this.estimatedDeliveryMinutes = m;
        }

        public boolean isOpen() {
            return isOpen;
        }

        public void setOpen(boolean open) {
            isOpen = open;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getOpeningTime() {
            return openingTime;
        }

        public void setOpeningTime(String t) {
            this.openingTime = t;
        }

        public String getClosingTime() {
            return closingTime;
        }

        public void setClosingTime(String t) {
            this.closingTime = t;
        }
    }
}
