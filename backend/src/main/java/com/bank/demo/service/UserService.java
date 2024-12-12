package com.bank.demo.service;

import com.bank.demo.entity.User;
import com.bank.demo.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        // Encrypt the password before saving the user
        user.setPassword(encryptPassword(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public boolean doesUserExist(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public double getBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBalance();
    }


    public boolean validateMpin(Long userId, String mpin) {
        return userRepository.existsByMpinAndId(mpin, userId);
    }

    public void updateBalance(Long userId, Double amount, String operation) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("DEBIT".equalsIgnoreCase(operation) && user.getBalance() < amount) {
            throw new RuntimeException("Insufficient funds");
        }

        double updatedBalance = "DEBIT".equalsIgnoreCase(operation)
                ? user.getBalance() - amount
                : user.getBalance() + amount;

        user.setBalance(updatedBalance);
        userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!checkPassword(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    private String encryptPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    private boolean checkPassword(String plainPassword, String encryptedPassword) {
        return BCrypt.checkpw(plainPassword, encryptedPassword);
    }
}
