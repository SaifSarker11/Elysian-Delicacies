package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class OrderItem {
    private String menuItemId;
    private String menuItemName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    @XmlElementWrapper(name = "selectedAddOns")
    @XmlElement(name = "addOn")
    private List<MenuAddOn> selectedAddOns;
    private String specialInstructions;

    public OrderItem() {
        this.selectedAddOns = new ArrayList<>();
    }

    public OrderItem(String menuItemId, String menuItemName, int quantity, double unitPrice) {
        this.menuItemId = menuItemId;
        this.menuItemName = menuItemName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = unitPrice * quantity;
        this.selectedAddOns = new ArrayList<>();
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getMenuItemName() {
        return menuItemName;
    }

    public void setMenuItemName(String menuItemName) {
        this.menuItemName = menuItemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<MenuAddOn> getSelectedAddOns() {
        return selectedAddOns;
    }

    public void setSelectedAddOns(List<MenuAddOn> selectedAddOns) {
        this.selectedAddOns = selectedAddOns;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public void calculateTotal() {
        double addOnTotal = selectedAddOns.stream().mapToDouble(MenuAddOn::getPrice).sum();
        this.totalPrice = (this.unitPrice + addOnTotal) * this.quantity;
    }
}
