package com.cts.analytics.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "transaction-service", url = "http://localhost:8083")
public interface TransactionClient {
    @GetMapping("/api/transactions/internal/range")
    List<TransactionDTO> getTransactionsByDateRange(
        @RequestParam LocalDateTime from,
        @RequestParam LocalDateTime to
    );
}
