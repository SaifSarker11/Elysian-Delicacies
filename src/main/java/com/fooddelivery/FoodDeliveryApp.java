package com.fooddelivery;

import com.fooddelivery.server.HttpApiServer;
import com.fooddelivery.server.SoapServicePublisher;
import com.fooddelivery.storage.XmlDataStore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FoodDeliveryApp {

    private static final int HTTP_PORT = 8080;
    private static final int SOAP_PORT = 8081;

    public static void main(String[] args) {
        System.out.println();
        System.out.println("  ╔══════════════════════════════════════════╗");
        System.out.println("  ║     🍕 Food Delivery Application 🍕     ║");
        System.out.println("  ║           Version 1.0.0                  ║");
        System.out.println("  ╚══════════════════════════════════════════╝");
        System.out.println();

        try {
            XmlDataStore dataStore = XmlDataStore.getInstance();
            dataStore.initializeSeedData();

            String frontendPath = determineFrontendPath();
            System.out.println("[App] Frontend path: " + frontendPath);

            SoapServicePublisher soapPublisher = new SoapServicePublisher(SOAP_PORT);
            soapPublisher.publish();

            HttpApiServer httpServer = new HttpApiServer(HTTP_PORT, frontendPath);
            httpServer.start();

            System.out.println();
            System.out.println("  ✅ Application started successfully!");
            System.out.println("  🌐 Open http://localhost:" + HTTP_PORT + " in your browser");
            System.out.println("  📋 SOAP WSDL at http://localhost:" + SOAP_PORT + "/ws/restaurant-search?wsdl");
            System.out.println();
            System.out.println("  Press Ctrl+C to stop the server.");
            System.out.println();

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\nShutting down...");
                httpServer.stop();
                soapPublisher.stop();
                System.out.println("Goodbye! 👋");
            }));

            Thread.currentThread().join();

        } catch (Exception e) {
            System.err.println("Failed to start application: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static String determineFrontendPath() {
        String[] possiblePaths = {
                "src/frontend",
                "src\\frontend",
                "frontend",
                "target/classes/frontend"
        };

        for (String path : possiblePaths) {
            Path p = Paths.get(path);
            if (Files.exists(p) && Files.isDirectory(p)) {
                Path indexHtml = p.resolve("index.html");
                if (Files.exists(indexHtml)) {
                    return p.toAbsolutePath().toString();
                }
            }
        }

        return "src/frontend";
    }
}
