package com.fooddelivery.service;

import com.fooddelivery.model.Address;
import com.fooddelivery.model.User;
import com.fooddelivery.storage.XmlDataStore;
import com.fooddelivery.util.IdGenerator;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;
import java.util.Optional;

public class UserService {

    private final XmlDataStore dataStore;

    public UserService() {
        this.dataStore = XmlDataStore.getInstance();
    }

    public User register(String name, String email, String password, String phone, String role, Address address) {
        if (dataStore.getUserByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + email);
        }

        User user = new User();
        user.setId(IdGenerator.generate());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(hashPassword(password));
        user.setPhone(phone);
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        user.setAddress(address);

        return dataStore.addUser(user);
    }

    public User login(String email, String password) {
        Optional<User> userOpt = dataStore.getUserByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(hashPassword(password))) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }

    public User getUserById(String id) {
        return dataStore.getUserById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
    }

    public User updateProfile(String userId, String name, String phone, Address address) {
        User user = getUserById(userId);
        if (name != null)
            user.setName(name);
        if (phone != null)
            user.setPhone(phone);
        if (address != null)
            user.setAddress(address);
        return dataStore.updateUser(user);
    }

    public List<User> getAllUsers() {
        return dataStore.getAllUsers();
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return password;
        }
    }
}
