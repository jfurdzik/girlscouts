package com.girlscouts.cookies.exceptions;

/** Thrown for invalid input that isn't caught by bean validation (e.g. bad state transitions). */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
