package com.fooddelivery.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class MenuItem {
    private String id;
    private String restaurantId;
    private String name;
    private String description;
    private double price;
    private String category;
    private boolean available;
    private int quantity;
    @XmlElementWrapper(name = "addOns")
    @XmlElement(name = "addOn")
    private List<MenuAddOn> addOns;
    private String imageUrl;

    public MenuItem() {
        this.addOns = new ArrayList<>();
    }

    public MenuItem(String id, String restaurantId, String name, String description,
            double price, String category, boolean available, int quantity) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.available = available;
        this.quantity = quantity;
        this.addOns = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public List<MenuAddOn> getAddOns() {
        return addOns;
    }

    public void setAddOns(List<MenuAddOn> addOns) {
        this.addOns = addOns;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @XmlRootElement(name = "menuItems")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class MenuItemList {
        @XmlElement(name = "menuItem")
        private List<MenuItem> menuItems = new ArrayList<>();

        public MenuItemList() {
        }

        public MenuItemList(List<MenuItem> menuItems) {
            this.menuItems = menuItems;
        }

        public List<MenuItem> getMenuItems() {
            return menuItems;
        }

        public void setMenuItems(List<MenuItem> menuItems) {
            this.menuItems = menuItems;
        }
    }
}
