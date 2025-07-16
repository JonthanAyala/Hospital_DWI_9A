package utez.edu.mx.hospitalback.security;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import utez.edu.mx.hospitalback.utils.APIResponse;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });

        APIResponse response = new APIResponse(
                "Favor de verificar los campos",
                errors,
                true,
                HttpStatus.BAD_REQUEST
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<APIResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "No tienes permisos para acceder a este recurso",
                null,
                true,
                HttpStatus.FORBIDDEN
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<APIResponse> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "Error de autenticación: " + ex.getMessage(),
                null,
                true,
                HttpStatus.UNAUTHORIZED
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<APIResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "Credenciales inválidas",
                null,
                true,
                HttpStatus.UNAUTHORIZED
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponse> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "Argumento inválido: " + ex.getMessage(),
                null,
                true,
                HttpStatus.BAD_REQUEST
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<APIResponse> handleRuntimeException(RuntimeException ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "Error interno del servidor",
                null,
                true,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
        return new ResponseEntity<>(response, response.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleGlobalException(Exception ex, WebRequest request) {
        APIResponse response = new APIResponse(
                "Ha ocurrido un error inesperado",
                null,
                true,
                HttpStatus.INTERNAL_SERVER_ERROR
        );
        return new ResponseEntity<>(response, response.getStatus());
    }
}
