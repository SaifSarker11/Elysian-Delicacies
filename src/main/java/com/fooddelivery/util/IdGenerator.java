package com.fooddelivery.util;

import java.util.UUID;

/**
 * Utility class for generating unique identifiers.
 */
public class IdGenerator {

    private IdGenerator() {}

    /**
     * Generates a short unique ID based on UUID.
     */
    public static String generate() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Generates a full UUID string.
     */
    public static String generateFull() {
        return UUID.randomUUID().toString();
    }

    /**
     * Generates a transaction ID for payments.
     */
    public static String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
