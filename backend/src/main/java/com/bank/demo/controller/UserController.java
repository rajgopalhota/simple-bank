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

    @GetMapping("/balance")
    public double getBalance(@RequestHeader("Authorization") String token) {
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        String username = jwtUtil.extractUsername(jwtToken);
        return userService.getBalance(username);
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
    @GetMapping("/getUser")
    public ResponseEntity<Object> getUser(@RequestHeader("Authorization") String token) {
        try {

            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

            String username = jwtUtil.extractUsername(jwtToken);
            User user = userService.getUserByUsername(username);

            // Create response DTO
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setId(user.getId());
            loginResponse.setUsername(user.getUsername());
            loginResponse.setEmail(user.getEmail());
            loginResponse.setMpin(user.getMpin());
            loginResponse.setAccountNumber(user.getAccountNumber());
            loginResponse.setVerified(user.getVerified());

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) {
        try {
            User user = userService.login(username, password);
            Map<String, Object> claims = Map.of(
                    "username", user.getUsername(),
                    "accountNumber", user.getAccountNumber(),
                    "email", user.getEmail()
            );
            String token = jwtUtil.generateToken(claims);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

}
