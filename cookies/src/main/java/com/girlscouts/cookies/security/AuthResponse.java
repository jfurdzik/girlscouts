package com.girlscouts.cookies.security;

/** What the frontend gets back after login/me — never includes the token itself (that's an httpOnly cookie). */
public record AuthResponse(Long id, String username, String firstName, String lastName, String role) {}
