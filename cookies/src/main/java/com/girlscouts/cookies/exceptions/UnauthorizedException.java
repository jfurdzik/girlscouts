package com.girlscouts.cookies.exceptions;

/** Thrown for authentication failures (bad credentials, expired/invalid token). */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
