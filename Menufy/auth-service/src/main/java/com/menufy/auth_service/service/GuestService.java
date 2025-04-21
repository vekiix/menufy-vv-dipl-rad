package com.menufy.auth_service.service;

import com.menufy.auth_service.exceptions.MissingGuestException;
import com.menufy.auth_service.models.CompanyTable;
import com.menufy.auth_service.models.Guest;
import com.menufy.auth_service.repository.GuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GuestService {
    private final GuestRepository guestRepository;
    private final RoleService roleService;

    public Guest createAndInsertGuest(CompanyTable tableRecord, String cmac, int scanCount) {
        Guest guest = new Guest();
        guest.setCMAC(cmac);
        guest.setRole(roleService.getRoleById(roleService.getGuestRoleId()));
        guest.setScanCount(scanCount);
        guest.setTable(tableRecord);

        guestRepository.save(guest);

        return guest;
    }

    public Guest findGuestByCMAC(String cmac) {
        Optional<Guest> guest = guestRepository.findById(cmac);
        if(guest.isPresent()) {
            return guest.get();
        }
        throw new MissingGuestException();
    }
}
