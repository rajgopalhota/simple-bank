package com.bank.demo.repository;

import com.bank.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByMpinAndId(String mpin, Long id); // For MPIN validation
}
