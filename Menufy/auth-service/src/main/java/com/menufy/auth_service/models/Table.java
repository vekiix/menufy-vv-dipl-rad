package com.menufy.auth_service.models;


import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
public class Table {

    @Id
    @Column(nullable = false)
    private String uid;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
