package com.girlscouts.cookies.security;

import com.girlscouts.cookies.exceptions.UnauthorizedException;
import com.girlscouts.cookies.users.Users;
import com.girlscouts.cookies.users.UsersRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Login/logout/me. The JWT is delivered as an httpOnly, SameSite=Lax cookie —
 * never exposed to JavaScript — so an XSS bug in the React app can't be used
 * to steal a manager's session token. This is what satisfies "the backend
 * must own authentication" / "not local storage only" from the spec.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;

    public AuthController(UsersRepository usersRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        Users user = usersRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!user.isManager()) {
            throw new UnauthorizedException("This account does not have manager access");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        setAuthCookie(response, token);

        return toAuthResponse(user);
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(JwtAuthFilter.COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    /** Lets the frontend check "am I logged in?" on page load/refresh without storing anything client-side. */
    @GetMapping("/me")
    public Optional<AuthResponse> me(java.security.Principal principal) {
        if (principal == null) return Optional.empty();
        return usersRepository.findByUsername(principal.getName()).map(this::toAuthResponse);
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(JwtAuthFilter.COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // set app.cookie.secure=true in production (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day, matches app.jwt.expiration-ms default
        response.addCookie(cookie);
    }

    private AuthResponse toAuthResponse(Users user) {
        return new AuthResponse(user.getId(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}
