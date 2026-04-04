package com.fooddelivery.service;

import com.fooddelivery.model.Payment;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.IdGenerator;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class PaymentService {

    private final XmlDataStore dataStore;

    public PaymentService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public Payment processPayment(String orderId, double amount, String method) {
        if (dataStore.getPaymentByOrderId(orderId).isPresent()) {
            throw new IllegalArgumentException("Payment already exists for order: " + orderId);
        }

        Payment payment = new Payment();
        payment.setId(IdGenerator.generate());
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setMethod(Payment.Method.valueOf(method.toUpperCase()));
        payment.setTransactionId(IdGenerator.generateTransactionId());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return dataStore.addPayment(payment);
    }

    public Payment getPaymentByOrderId(String orderId) {
        return dataStore.getPaymentByOrderId(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for order: " + orderId));
    }

    public Payment refundPayment(String orderId) {
        Payment payment = getPaymentByOrderId(orderId);
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        return dataStore.updatePayment(payment);
    }
}
