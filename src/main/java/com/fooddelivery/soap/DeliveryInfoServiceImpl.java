package com.fooddelivery.soap;

import com.fooddelivery.model.DeliveryRider;
import com.fooddelivery.service.DeliveryService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebService(serviceName = "DeliveryInfoService")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public class DeliveryInfoServiceImpl {

    private final DeliveryService deliveryService = new DeliveryService();

    @WebMethod
    public RiderListResult getAvailableRiders(@WebParam(name = "area") String area) {
        List<DeliveryRider> riders = deliveryService.getAvailableRiders(area);
        RiderListResult result = new RiderListResult();
        result.setArea(area);
        result.setTotalAvailable(riders.size());

        List<RiderInfo> infos = new ArrayList<>();
        for (DeliveryRider r : riders) {
            RiderInfo info = new RiderInfo();
            info.setId(r.getId());
            info.setName(r.getName());
            info.setPhone(r.getPhone());
            info.setVehicleType(r.getVehicleType());
            info.setRating(r.getRating());
            info.setCurrentArea(r.getCurrentArea());
            infos.add(info);
        }
        result.setRiders(infos);
        return result;
    }

    @WebMethod
    public DeliveryEstimateResult getDeliveryEstimate(
            @WebParam(name = "restaurantId") String restaurantId,
            @WebParam(name = "customerLatitude") double customerLat,
            @WebParam(name = "customerLongitude") double customerLon) {
        try {
            Map<String, Object> estimate = deliveryService.getDeliveryEstimate(restaurantId, customerLat, customerLon);

            DeliveryEstimateResult result = new DeliveryEstimateResult();
            result.setRestaurantName((String) estimate.get("restaurantName"));
            result.setDistanceKm((Double) estimate.get("distanceKm"));
            result.setDeliveryFee((Double) estimate.get("deliveryFee"));
            result.setEstimatedMinutes((Integer) estimate.get("estimatedMinutes"));
            return result;
        } catch (Exception e) {
            DeliveryEstimateResult result = new DeliveryEstimateResult();
            result.setRestaurantName("Error: " + e.getMessage());
            return result;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RiderListResult {
        private String area;
        private int totalAvailable;
        @XmlElementWrapper(name = "riders")
        @XmlElement(name = "rider")
        private List<RiderInfo> riders = new ArrayList<>();

        public String getArea() {
            return area;
        }

        public void setArea(String a) {
            this.area = a;
        }

        public int getTotalAvailable() {
            return totalAvailable;
        }

        public void setTotalAvailable(int t) {
            this.totalAvailable = t;
        }

        public List<RiderInfo> getRiders() {
            return riders;
        }

        public void setRiders(List<RiderInfo> r) {
            this.riders = r;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RiderInfo {
        private String id;
        private String name;
        private String phone;
        private String vehicleType;
        private double rating;
        private String currentArea;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String n) {
            this.name = n;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String p) {
            this.phone = p;
        }

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String v) {
            this.vehicleType = v;
        }

        public double getRating() {
            return rating;
        }

        public void setRating(double r) {
            this.rating = r;
        }

        public String getCurrentArea() {
            return currentArea;
        }

        public void setCurrentArea(String c) {
            this.currentArea = c;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class DeliveryEstimateResult {
        private String restaurantName;
        private double distanceKm;
        private double deliveryFee;
        private int estimatedMinutes;

        public String getRestaurantName() {
            return restaurantName;
        }

        public void setRestaurantName(String r) {
            this.restaurantName = r;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public void setDistanceKm(double d) {
            this.distanceKm = d;
        }

        public double getDeliveryFee() {
            return deliveryFee;
        }

        public void setDeliveryFee(double f) {
            this.deliveryFee = f;
        }

        public int getEstimatedMinutes() {
            return estimatedMinutes;
        }

        public void setEstimatedMinutes(int m) {
            this.estimatedMinutes = m;
        }
    }
}
