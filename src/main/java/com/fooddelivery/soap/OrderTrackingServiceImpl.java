package com.fooddelivery.soap;

import com.fooddelivery.model.Order;
import com.fooddelivery.service.OrderService;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@WebService(serviceName = "OrderTrackingService")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public class OrderTrackingServiceImpl {

    private final OrderService orderService = new OrderService();

    @WebMethod
    public OrderTrackingResult trackOrder(@WebParam(name = "orderId") String orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            OrderTrackingResult result = new OrderTrackingResult();
            result.setOrderId(order.getId());
            result.setStatus(order.getStatus().name());
            result.setRestaurantName(order.getRestaurantName());
            result.setRiderName(order.getRiderName() != null ? order.getRiderName() : "Not assigned");
            result.setEstimatedDelivery(order.getEstimatedDelivery());
            result.setTotal(order.getTotal());
            result.setCreatedAt(order.getCreatedAt());
            result.setDeliveryAddress(
                    order.getDeliveryAddress() != null ? order.getDeliveryAddress().toString() : "N/A");

            result.setStatusDescription(getStatusDescription(order.getStatus()));
            return result;
        } catch (Exception e) {
            OrderTrackingResult result = new OrderTrackingResult();
            result.setOrderId(orderId);
            result.setStatus("NOT_FOUND");
            result.setStatusDescription("Order not found");
            return result;
        }
    }

    @WebMethod
    public OrderHistoryResult getOrderHistory(@WebParam(name = "customerId") String customerId) {
        List<Order> orders = orderService.getOrdersByCustomer(customerId);
        OrderHistoryResult result = new OrderHistoryResult();
        result.setCustomerId(customerId);
        result.setTotalOrders(orders.size());

        List<OrderSummary> summaries = new ArrayList<>();
        for (Order o : orders) {
            OrderSummary summary = new OrderSummary();
            summary.setOrderId(o.getId());
            summary.setRestaurantName(o.getRestaurantName());
            summary.setStatus(o.getStatus().name());
            summary.setTotal(o.getTotal());
            summary.setCreatedAt(o.getCreatedAt());
            summary.setItemCount(o.getItems().size());
            summaries.add(summary);
        }
        result.setOrders(summaries);
        return result;
    }

    private String getStatusDescription(Order.Status status) {
        return switch (status) {
            case PLACED -> "Your order has been placed and is being reviewed by the restaurant.";
            case CONFIRMED -> "The restaurant has confirmed your order and will start preparing soon.";
            case PREPARING -> "Your food is being prepared with care.";
            case READY -> "Your order is ready! A rider is picking it up.";
            case PICKED_UP -> "Your rider has picked up your food and is on the way!";
            case DELIVERED -> "Your order has been delivered. Enjoy your meal!";
            case CANCELLED -> "This order has been cancelled.";
        };
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class OrderTrackingResult {
        private String orderId;
        private String status;
        private String statusDescription;
        private String restaurantName;
        private String riderName;
        private String estimatedDelivery;
        private double total;
        private String createdAt;
        private String deliveryAddress;

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String orderId) {
            this.orderId = orderId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getStatusDescription() {
            return statusDescription;
        }

        public void setStatusDescription(String d) {
            this.statusDescription = d;
        }

        public String getRestaurantName() {
            return restaurantName;
        }

        public void setRestaurantName(String n) {
            this.restaurantName = n;
        }

        public String getRiderName() {
            return riderName;
        }

        public void setRiderName(String n) {
            this.riderName = n;
        }

        public String getEstimatedDelivery() {
            return estimatedDelivery;
        }

        public void setEstimatedDelivery(String e) {
            this.estimatedDelivery = e;
        }

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String c) {
            this.createdAt = c;
        }

        public String getDeliveryAddress() {
            return deliveryAddress;
        }

        public void setDeliveryAddress(String a) {
            this.deliveryAddress = a;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class OrderHistoryResult {
        private String customerId;
        private int totalOrders;
        @XmlElementWrapper(name = "orders")
        @XmlElement(name = "order")
        private List<OrderSummary> orders = new ArrayList<>();

        public String getCustomerId() {
            return customerId;
        }

        public void setCustomerId(String c) {
            this.customerId = c;
        }

        public int getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(int t) {
            this.totalOrders = t;
        }

        public List<OrderSummary> getOrders() {
            return orders;
        }

        public void setOrders(List<OrderSummary> o) {
            this.orders = o;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class OrderSummary {
        private String orderId;
        private String restaurantName;
        private String status;
        private double total;
        private String createdAt;
        private int itemCount;

        public String getOrderId() {
            return orderId;
        }

        public void setOrderId(String o) {
            this.orderId = o;
        }

        public String getRestaurantName() {
            return restaurantName;
        }

        public void setRestaurantName(String n) {
            this.restaurantName = n;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String s) {
            this.status = s;
        }

        public double getTotal() {
            return total;
        }

        public void setTotal(double t) {
            this.total = t;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String c) {
            this.createdAt = c;
        }

        public int getItemCount() {
            return itemCount;
        }

        public void setItemCount(int i) {
            this.itemCount = i;
        }
    }
}
