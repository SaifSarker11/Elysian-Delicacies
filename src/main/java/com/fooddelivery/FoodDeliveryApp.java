package com.fooddelivery;

import com.fooddelivery.server.HttpApiServer;
import com.fooddelivery.server.SoapServicePublisher;
import com.fooddelivery.storage.XmlDataStore;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FoodDeliveryApp {

    private static final int DEFAULT_HTTP_PORT = 8080;
    private static final int DEFAULT_SOAP_PORT = 8081;

    public static void main(String[] args) {
        int httpPort = DEFAULT_HTTP_PORT;
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.trim().isEmpty()) {
            try {
                httpPort = Integer.parseInt(envPort.trim());
            } catch (NumberFormatException ignored) {}
        }

        int soapPort = DEFAULT_SOAP_PORT;
        String envSoapPort = System.getenv("SOAP_PORT");
        if (envSoapPort != null && !envSoapPort.trim().isEmpty()) {
            try {
                soapPort = Integer.parseInt(envSoapPort.trim());
            } catch (NumberFormatException ignored) {}
        }
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

            SoapServicePublisher soapPublisher = null;
            try {
                soapPublisher = new SoapServicePublisher(soapPort);
                soapPublisher.publish();
            } catch (Exception se) {
                System.err.println("[App] Warning: SOAP publisher could not bind to port " + soapPort + ": " + se.getMessage());
            }

            HttpApiServer httpServer = new HttpApiServer(httpPort, frontendPath);
            httpServer.start();

            System.out.println();
            System.out.println("  ✅ Application started successfully!");
            System.out.println("  🌐 Open http://localhost:" + httpPort + " in your browser");
            if (soapPublisher != null) {
                System.out.println("  📋 SOAP WSDL at http://localhost:" + soapPort + "/ws/restaurant-search?wsdl");
            }
            System.out.println();
            System.out.println("  Press Ctrl+C to stop the server.");
            System.out.println();

            final SoapServicePublisher finalSoap = soapPublisher;
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\nShutting down...");
                httpServer.stop();
                if (finalSoap != null) {
                    finalSoap.stop();
                }
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
