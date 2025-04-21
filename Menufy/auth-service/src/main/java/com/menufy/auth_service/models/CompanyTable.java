package com.menufy.auth_service.models;


import com.menufy.auth_service.exceptions.InvalidRequestParametersException;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "table")
public class CompanyTable {

    @Id
    @NotNull
    @Column(unique = true)
    private String uid;

    @Column
    private int scanCount = 0;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    public CompanyTable(){}

    public CompanyTable(String _uid, Company _company)
    {
        this.uid = _uid;
        this.company = _company;
    }

    @Override
    public String toString(){
        return this.uid;
    }

    public void updateTableScanCount(int scanCount)
    {
        if(scanCount <= this.getScanCount()){
            throw new InvalidRequestParametersException();
        }
        this.setScanCount(scanCount);
    }
}
