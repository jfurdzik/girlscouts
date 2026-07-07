package com.girlscouts.cookies.exceptions;

import java.time.Instant;
import java.util.Map;

/** Consistent JSON error body shape returned for every failed request. */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        Map<String, String> fieldErrors
) {
    public ApiError(int status, String error, String message) {
        this(Instant.now(), status, error, message, null);
    }

    public ApiError(int status, String error, String message, Map<String, String> fieldErrors) {
        this(Instant.now(), status, error, message, fieldErrors);
    }
}
