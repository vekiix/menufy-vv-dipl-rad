package com.menufy.order_service.service;
import com.menufy.order_service.dto.CompanyDto;
import com.menufy.order_service.dto.TableDto;
import com.menufy.order_service.models.Company;
import com.menufy.order_service.models.Order;
import com.menufy.order_service.models.Table;
import com.menufy.order_service.repository.CompanyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CompanyService {

    public final CompanyRepository companyRepository;

    private Company findCompany(String _companyId){
        Optional<Company> company = companyRepository.findById(_companyId);
        if(company.isPresent()){
            return company.get();
        }
        throw new RuntimeException("Company with given ID wasn't found");
    }

    public void addOrderToPendingOrderList(Order order) {
        Company company = this.findCompany(order.getCompanyId());
        company.addOrderToPendingOrderList(order);
        companyRepository.save(company);
    }

    public void removeOrderFromPending(Order order) {
        Company company = findCompany(order.getCompanyId());
        company.removeOrderFromPendingOrderList(order);
        companyRepository.save(company);
    }

    public void migrateOrderFromPendingToActive(Order order) {
        Company company = findCompany(order.getCompanyId());
        company.removeOrderFromPendingOrderList(order);
        company.addOrderToActiveListOnTable(order);
        companyRepository.save(company);
    }

    public void removeOrderFromActive(Order order) {
        Company company = findCompany(order.getCompanyId());
        company.removeOrderFromActiveListOnTable(order);
        companyRepository.save(company);
    }

    public void createOrUpdateCompany(CompanyDto dto) {
        Company company = companyRepository.findById(dto.id)
                        .orElseGet(Company::new);

        company.setId(dto.id);
        company.setName(dto.name);
        company.setOib(dto.oib);

        companyRepository.save(company);
    }

    public void createOrUpdateCompanyTable(TableDto dto) {
        Company company = companyRepository.findById(dto.companyId)
                .orElseGet(Company::new);

        Table table = new Table(dto.companyId, dto.uid);
        table.setName(dto.name);
        company.addOrUpdateTableFromTableList(table);

        companyRepository.save(company);
    }

    public void deleteCompanyTable(TableDto dto) {
        Company company = companyRepository.findById(dto.companyId)
                .orElseGet(Company::new);

        Table table = new Table(dto.companyId, dto.uid);
        company.removeTableFromTableList(table);

        companyRepository.save(company);
    }

    public void deleteCompany(CompanyDto _company) {
        Company company = findCompany(_company.id);
        companyRepository.delete(company);
    }

    public List<Table> getTableList(String companyId) {
        Company company = this.findCompany(companyId);
        return company.getTables();
    }

    public List<Order> getCompanyPendingOrders(String companyId) {
        Company company = this.findCompany(companyId);
        return company.getPendingOrders();
    }
}
