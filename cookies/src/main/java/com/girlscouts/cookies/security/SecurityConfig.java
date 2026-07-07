package com.girlscouts.cookies.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * All authorization rules live here in one place, instead of ad-hoc checks
 * scattered across controllers. Roles: ADMIN and STAFF are "managers" per the
 * product spec; VOLUNTEER is an unauthenticated end-user concept (volunteers
 * never log in — they just sign up for events / submit leads publicly).
 *
 * Stateless JWT (no HttpSession) so it works cleanly with a SPA and survives
 * server restarts without needing sticky sessions.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // stateless JWT API, not cookie-session-based CSRF risk
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ---- Public site: browsing events & submitting yourself as a volunteer/lead ----
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/events/*/signup").permitAll() // public volunteer signup
                .requestMatchers(HttpMethod.GET, "/api/schools/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/leadcards").permitAll()   // QR lead form
                .requestMatchers(HttpMethod.GET, "/api/availability/**").permitAll()
                // static frontend assets
                .requestMatchers("/", "/index.html", "/contact.html", "/manager.html",
                                  "/assets/**", "/favicon.svg", "/icons.svg").permitAll()
                .requestMatchers("/h2-console/**").permitAll() // dev-only DB console

                // ---- Everything else requires a logged-in manager (ADMIN or STAFF) ----
                .anyRequest().hasAnyRole("ADMIN", "STAFF")
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // needed for h2-console
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
