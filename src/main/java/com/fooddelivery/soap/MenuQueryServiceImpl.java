package com.fooddelivery.soap;

import com.fooddelivery.model.MenuItem;
import com.fooddelivery.model.MenuAddOn;
import com.fooddelivery.service.MenuService;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;
import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@WebService(serviceName = "MenuQueryService")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT)
public class MenuQueryServiceImpl {

    private final MenuService menuService = new MenuService();

    @WebMethod
    public MenuResult getMenu(@WebParam(name = "restaurantId") String restaurantId) {
        List<MenuItem> items = menuService.getMenuByRestaurant(restaurantId);
        MenuResult result = new MenuResult();
        result.setRestaurantId(restaurantId);
        result.setTotalItems(items.size());

        List<MenuItemInfo> infos = new ArrayList<>();
        for (MenuItem item : items) {
            infos.add(toMenuItemInfo(item));
        }
        result.setItems(infos);
        return result;
    }

    @WebMethod
    public MenuResult searchMenuItem(@WebParam(name = "keyword") String keyword) {
        List<MenuItem> items = menuService.searchMenuItems(keyword);
        MenuResult result = new MenuResult();
        result.setRestaurantId("all");
        result.setTotalItems(items.size());

        List<MenuItemInfo> infos = new ArrayList<>();
        for (MenuItem item : items) {
            infos.add(toMenuItemInfo(item));
        }
        result.setItems(infos);
        return result;
    }

    private MenuItemInfo toMenuItemInfo(MenuItem item) {
        MenuItemInfo info = new MenuItemInfo();
        info.setId(item.getId());
        info.setRestaurantId(item.getRestaurantId());
        info.setName(item.getName());
        info.setDescription(item.getDescription());
        info.setPrice(item.getPrice());
        info.setCategory(item.getCategory());
        info.setAvailable(item.isAvailable());
        info.setQuantity(item.getQuantity());

        if (item.getAddOns() != null) {
            List<String> addOnNames = new ArrayList<>();
            for (MenuAddOn addOn : item.getAddOns()) {
                addOnNames.add(addOn.getName() + " (+" + addOn.getPrice() + ")");
            }
            info.setAddOns(addOnNames);
        }
        return info;
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class MenuResult {
        private String restaurantId;
        private int totalItems;
        @XmlElementWrapper(name = "items")
        @XmlElement(name = "item")
        private List<MenuItemInfo> items = new ArrayList<>();

        public String getRestaurantId() {
            return restaurantId;
        }

        public void setRestaurantId(String r) {
            this.restaurantId = r;
        }

        public int getTotalItems() {
            return totalItems;
        }

        public void setTotalItems(int t) {
            this.totalItems = t;
        }

        public List<MenuItemInfo> getItems() {
            return items;
        }

        public void setItems(List<MenuItemInfo> i) {
            this.items = i;
        }
    }

    @XmlRootElement
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class MenuItemInfo {
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
        private List<String> addOns = new ArrayList<>();

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getRestaurantId() {
            return restaurantId;
        }

        public void setRestaurantId(String r) {
            this.restaurantId = r;
        }

        public String getName() {
            return name;
        }

        public void setName(String n) {
            this.name = n;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String d) {
            this.description = d;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double p) {
            this.price = p;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String c) {
            this.category = c;
        }

        public boolean isAvailable() {
            return available;
        }

        public void setAvailable(boolean a) {
            this.available = a;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int q) {
            this.quantity = q;
        }

        public List<String> getAddOns() {
            return addOns;
        }

        public void setAddOns(List<String> a) {
            this.addOns = a;
        }
    }
}
