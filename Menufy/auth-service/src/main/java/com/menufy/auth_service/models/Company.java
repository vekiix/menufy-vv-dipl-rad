package com.menufy.auth_service.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Auto-generate unique ID
    private String id;

    @NotNull
    @Size(max = 100)
    private String companyName;

    @NotNull
    @Size(min = 11, max = 11)
    @Column(unique = true)
    private String oib;

    @Size(min = 32, max = 32)
    private String encryptionKey;

    private String logo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Override
    public String toString() {
        return this.companyName;
    }

    @PreUpdate
    private void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
