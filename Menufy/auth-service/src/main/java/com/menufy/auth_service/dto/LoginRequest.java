package com.menufy.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.menufy.auth_service.utils.Messages;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequest {

    @NotNull(message = Messages.IS_NULL_ERROR)
    @NotBlank(message = Messages.IS_BLANK_ERROR)
    private String Username; // Field name starts with uppercase as per requirement

    @NotNull(message = Messages.IS_NULL_ERROR)
    @NotBlank(message = Messages.IS_BLANK_ERROR)
    private String Password;
}
