package com.br.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Configuração para servir arquivos estáticos da pasta frontend
        registry.addResourceHandler("/frontend/**")
                .addResourceLocations("classpath:/static/frontend/")
                .setCachePeriod(0);
                
    // Leave default static resource handling for classpath:/static/ alone
    // (Spring Boot serves classpath:/static/ automatically). Avoid adding a /**
    // resource handler here because it can shadow API controllers.
    }
}