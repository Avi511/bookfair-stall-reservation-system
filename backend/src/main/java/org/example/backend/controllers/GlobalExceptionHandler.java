package org.example.backend.controllers;

import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", safeMessage(e, "Invalid request")));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNoSuchElement(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", safeMessage(e, "Not found")));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", safeMessage(e, "User not found")));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", safeMessage(e, "Unauthorized")));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", safeMessage(e, "Invalid credentials")));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        e.getBindingResult().getFieldErrors()
                .forEach(error -> errors.putIfAbsent(
                        error.getField(),
                        safeMessage(error.getDefaultMessage(), "Invalid value")
                ));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Validation failed");
        body.put("errors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        var root = e.getMostSpecificCause();
        String rootMessage = root == null ? null : root.getMessage();
        String normalized = rootMessage == null ? "" : rootMessage.toLowerCase();

        String message = (normalized.contains("duplicate key") || normalized.contains("unique constraint"))
                ? "Duplicate value violates a unique constraint."
                : "Request violates data integrity constraints.";

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", message));
    }

    @ExceptionHandler(MissingRequestCookieException.class)
    public ResponseEntity<Map<String, String>> handleMissingCookie(MissingRequestCookieException e) {
        if ("refreshToken".equals(e.getCookieName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Refresh token cookie is required."));
        }

        return ResponseEntity.badRequest()
                .body(Map.of("message", safeMessage(e.getMessage(), "Missing required cookie.")));
    }

    private String safeMessage(RuntimeException e, String fallback) {
        return safeMessage(e.getMessage(), fallback);
    }

    private String safeMessage(String message, String fallback) {
        return (message == null || message.isBlank()) ? fallback : message;
    }
}
