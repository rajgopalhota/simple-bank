package com.bank.demo.controller;

import com.bank.demo.dto.TransactionRequest;
import com.bank.demo.entity.Transaction;
import com.bank.demo.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUserId(@PathVariable Long userId) {
        return transactionService.getAllTransactionsByUserId(userId);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferFunds(@RequestBody TransactionRequest transactionRequest) {
        try {
            String message = transactionService.processTransaction(
                    transactionRequest.getFromUserId(),
                    transactionRequest.getToUserId(),
                    transactionRequest.getAmount(),
                    transactionRequest.getMpin());
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
