package com.menufy.auth_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user_role")
public class Role {

    @Id
    private int id;

    @Column
    private String roleName;

    @Column
    private String roleIdentifier;

    @Override
    public String toString() {
        return this.roleName;
    }

    @Column
    private String roleDescription;


}
