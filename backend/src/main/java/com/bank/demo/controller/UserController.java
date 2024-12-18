package com.bank.demo.controller;

import com.bank.demo.dto.LoginResponse;
import com.bank.demo.entity.User;
import com.bank.demo.service.UserService;
import com.bank.demo.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/reg")
    public ResponseEntity<String> createUser(@RequestBody User user) {
        try {
            if (userService.doesUserExist(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists");
            }

            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while creating the user");
        }
    }

    @GetMapping("/balance/{userId}")
    public double getBalance(@PathVariable Long userId) {
        return userService.getBalance(userId);
    }

    @GetMapping("/check/{accountNumber}")
    public ResponseEntity<Object> checkAccountNumber(@PathVariable String accountNumber) {
        try {
            User user = userService.doesAccountNumberExist(accountNumber);
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setUsername(user.getUsername());
            loginResponse.setEmail(user.getEmail());
            loginResponse.setAccountNumber(user.getAccountNumber());
            loginResponse.setVerified(user.getVerified());

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/verify/{accountNumber}")
    public ResponseEntity<String> verifyUser(@PathVariable String accountNumber) {
        try {
            userService.verifyUser(accountNumber);
            return ResponseEntity.ok("User verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) {
        try {
            User user = userService.login(username, password);
            System.out.println(user.getUsername());
            // Generate JWT token with claims
            Map<String, Object> claims = Map.of(
                    "username", user.getUsername(),
                    "accountNumber", user.getAccountNumber(),
                    "email", user.getEmail()
            );

            String token = jwtUtil.generateToken(claims);
            System.out.println(token);
            // Create response with the token
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setId(user.getId());
            loginResponse.setUsername(user.getUsername());
            loginResponse.setEmail(user.getEmail());
            loginResponse.setBalance(user.getBalance());
            loginResponse.setMpin(user.getMpin());
            loginResponse.setAccountNumber(user.getAccountNumber());
            loginResponse.setVerified(user.getVerified());
            loginResponse.setToken(token); // Add token to response
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

}
