package com.fooddelivery.server;

import com.fooddelivery.soap.*;
import jakarta.xml.ws.Endpoint;

public class SoapServicePublisher {

    private final int port;
    private Endpoint restaurantSearchEndpoint;
    private Endpoint orderTrackingEndpoint;
    private Endpoint deliveryInfoEndpoint;
    private Endpoint menuQueryEndpoint;

    public SoapServicePublisher(int port) {
        this.port = port;
    }

    public void publish() {
        String baseUrl = "http://localhost:" + port + "/ws";

        restaurantSearchEndpoint = Endpoint.publish(
                baseUrl + "/restaurant-search",
                new RestaurantSearchServiceImpl());

        orderTrackingEndpoint = Endpoint.publish(
                baseUrl + "/order-tracking",
                new OrderTrackingServiceImpl());

        deliveryInfoEndpoint = Endpoint.publish(
                baseUrl + "/delivery-info",
                new DeliveryInfoServiceImpl());

        menuQueryEndpoint = Endpoint.publish(
                baseUrl + "/menu-query",
                new MenuQueryServiceImpl());

        System.out.println("==============================================");
        System.out.println("  SOAP Web Services published on port " + port);
        System.out.println("  WSDL URLs:");
        System.out.println("    " + baseUrl + "/restaurant-search?wsdl");
        System.out.println("    " + baseUrl + "/order-tracking?wsdl");
        System.out.println("    " + baseUrl + "/delivery-info?wsdl");
        System.out.println("    " + baseUrl + "/menu-query?wsdl");
        System.out.println("==============================================");
    }

    public void stop() {
        if (restaurantSearchEndpoint != null)
            restaurantSearchEndpoint.stop();
        if (orderTrackingEndpoint != null)
            orderTrackingEndpoint.stop();
        if (deliveryInfoEndpoint != null)
            deliveryInfoEndpoint.stop();
        if (menuQueryEndpoint != null)
            menuQueryEndpoint.stop();
        System.out.println("SOAP Web Services stopped.");
    }
}
