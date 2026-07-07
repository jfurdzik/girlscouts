package com.girlscouts.cookies.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Single source of truth for CORS, replacing the scattered @CrossOrigin("*")
 * annotations that used to be sprinkled across individual controllers.
 *
 * Allows ANY origin (Replit, Vite on any port, etc.) rather than maintaining
 * a hardcoded list — deploy hosts like Replit hand out URLs that change, so a
 * fixed allow-list breaks the moment the URL is different from what's on file.
 *
 * Note: a literal wildcard string "*" is rejected by browsers when the
 * request also carries credentials (our auth cookie) — that's a browser rule,
 * not something Spring can bypass. setAllowedOriginPatterns("*") gets the same
 * "allow everything" behavior in a way browsers accept: Spring echoes back
 * whatever Origin header the actual request had, rather than sending a literal
 * "*", which satisfies the browser's credentialed-request rule.
 *
 * This isn't as loose as it sounds: the auth cookie is httpOnly + SameSite=Lax,
 * so a third-party site's JavaScript can't get it attached to a cross-site
 * fetch() call in the first place, regardless of this CORS setting. CORS here
 * mainly matters for your own frontend (wherever it's hosted) to be able to
 * read the API's responses at all.
 */
@Configuration
public class CorsConfig {

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        // Must run BEFORE Spring Security's filter chain, or Security can reject
        // a request (or a CORS preflight) before this filter ever gets a chance
        // to respond to it.
        FilterRegistrationBean<CorsFilter> registration = new FilterRegistrationBean<>(new CorsFilter(source));
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
