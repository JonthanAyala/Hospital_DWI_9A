package utez.edu.mx.hospitalback.utils;

import org.springframework.http.HttpStatus;

public class APIResponse {
    private String message;
    private Object data;
    private boolean error;
    private HttpStatus status;

    public APIResponse(String message, HttpStatus status, boolean error) {
        this.message = message;
        this.status = status;
        this.error = error;
    }

    public APIResponse(String message, Object data, HttpStatus status) {
        this.message = message;
        this.data = data;
        this.status = status;
    }

    public APIResponse(String message, Object data, boolean error, HttpStatus status) {
        this.message = message;
        this.data = data;
        this.error = error;
        this.status = status;
    }

    public APIResponse() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public boolean isError() {
        return error;
    }

    public void setError(boolean error) {
        this.error = error;
    }
}
