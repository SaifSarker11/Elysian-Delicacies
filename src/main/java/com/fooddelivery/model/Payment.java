package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class Payment {

    public enum Method {
        CASH, CARD, MOBILE_WALLET
    }

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    private String id;
    private String orderId;
    private double amount;
    private Method method;
    private PaymentStatus status;
    private String transactionId;
    private String paidAt;

    public Payment() {
        this.status = PaymentStatus.PENDING;
    }

    public Payment(String id, String orderId, double amount, Method method) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.PENDING;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Method getMethod() {
        return method;
    }

    public void setMethod(Method method) {
        this.method = method;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(String paidAt) {
        this.paidAt = paidAt;
    }

    @XmlRootElement(name = "payments")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class PaymentList {
        @XmlElement(name = "payment")
        private List<Payment> payments = new ArrayList<>();

        public PaymentList() {
        }

        public PaymentList(List<Payment> payments) {
            this.payments = payments;
        }

        public List<Payment> getPayments() {
            return payments;
        }

        public void setPayments(List<Payment> payments) {
            this.payments = payments;
        }
    }
}
