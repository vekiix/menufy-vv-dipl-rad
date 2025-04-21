package com.menufy.order_service.config;

import com.menufy.order_service.dto.BaseClaims;
import com.menufy.order_service.dto.Observer;
import com.menufy.order_service.dto.OrderObservable;
import com.menufy.order_service.dto.OrderObserver;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

public class WebSocketSubscriptionListener implements ApplicationListener<SessionSubscribeEvent> {
    @Override
    public void onApplicationEvent(SessionSubscribeEvent event) {
        System.out.println("Subscribe");

        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Observer observer = new OrderObserver();
        observer.setCompanyId(claims.getCompanyId());
        OrderObservable.subscribe(observer);

        System.out.println("Observer registered for company - " + claims.getCompanyId());
    }
}
