package com.bank.demo.service;

import com.bank.demo.entity.User;
import com.bank.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
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
}
