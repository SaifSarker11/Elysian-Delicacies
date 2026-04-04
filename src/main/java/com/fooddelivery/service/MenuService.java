package com.fooddelivery.service;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.IdGenerator;
import java.util.List;

public class MenuService {

    private final XmlDataStore dataStore;

    public MenuService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public List<MenuItem> getMenuByRestaurant(String restaurantId) {
        return dataStore.getMenuByRestaurant(restaurantId);
    }

    public MenuItem getMenuItemById(String itemId) {
        return dataStore.getMenuItemById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemId));
    }

    public MenuItem addMenuItem(MenuItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId(IdGenerator.generate());
        }
        return dataStore.addMenuItem(item);
    }

    public MenuItem updateMenuItem(MenuItem item) {
        MenuItem existing = getMenuItemById(item.getId());
        if (item.getName() != null)
            existing.setName(item.getName());
        if (item.getDescription() != null)
            existing.setDescription(item.getDescription());
        if (item.getPrice() > 0)
            existing.setPrice(item.getPrice());
        if (item.getCategory() != null)
            existing.setCategory(item.getCategory());
        existing.setAvailable(item.isAvailable());
        existing.setQuantity(item.getQuantity());
        if (item.getAddOns() != null)
            existing.setAddOns(item.getAddOns());
        if (item.getImageUrl() != null)
            existing.setImageUrl(item.getImageUrl());
        return dataStore.updateMenuItem(existing);
    }

    public MenuItem toggleAvailability(String itemId) {
        MenuItem item = getMenuItemById(itemId);
        item.setAvailable(!item.isAvailable());
        return dataStore.updateMenuItem(item);
    }

    public boolean deleteMenuItem(String itemId) {
        return dataStore.deleteMenuItem(itemId);
    }

    public List<MenuItem> searchMenuItems(String keyword) {
        return dataStore.searchMenuItems(keyword);
    }

    public List<MenuItem> getAllMenuItems() {
        return dataStore.getAllMenuItems();
    }
}
