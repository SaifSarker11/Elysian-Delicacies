package com.fooddelivery.server;

import com.fooddelivery.rest.*;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class HttpApiServer {

    private final HttpServer server;
    private final int port;

    public HttpApiServer(int port, String frontendPath) throws IOException {
        this.port = port;
        this.server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/api/auth", new UserHandler());
        server.createContext("/api/restaurants", new RestaurantHandler());
        server.createContext("/api/menu", new MenuHandler());
        server.createContext("/api/orders", new OrderHandler());
        server.createContext("/api/payments", new PaymentHandler());
        server.createContext("/api/delivery", new DeliveryHandler());
        server.createContext("/api/coupons", new CouponHandler());
        server.createContext("/", new StaticFileHandler(frontendPath));
        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(10));
    }

    public void start() {
        server.start();
        System.out.println("==============================================");
        System.out.println("  HTTP API Server started on port " + port);
        System.out.println("  Frontend: http://localhost:" + port);
        System.out.println("  REST API: http://localhost:" + port + "/api/");
        System.out.println("==============================================");
    }

    public void stop() {
        server.stop(0);
        System.out.println("HTTP API Server stopped.");
    }
}
