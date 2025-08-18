package utez.edu.mx.hospitalback.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class JWTUtils {

    private static final Pattern BASE64_REGEX =
            Pattern.compile("^[A-Za-z0-9+/]+={0,2}$"); // check rápido

    private final SecretKey key;
    private final long expirationMs;
    private final String issuer;

    public JWTUtils(
            @Value("${secret.key}") String secretProvided,
            @Value("${security.jwt.expiration:36000000}") long expirationMs, // 10h por defecto
            @Value("${security.jwt.issuer:hospital-9a}") String issuer
    ) {
        this.key = buildKey(secretProvided);
        this.expirationMs = expirationMs;
        this.issuer = issuer;
    }

    private SecretKey buildKey(String secretProvided) {
        if (secretProvided == null || secretProvided.isBlank()) {
            throw new IllegalArgumentException("JWT secret vacío (secret.key).");
        }
        // ¿Parece Base64?
        if (secretProvided.length() % 4 == 0 && BASE64_REGEX.matcher(secretProvided).matches()) {
            byte[] decoded = Decoders.BASE64.decode(secretProvided);
            return Keys.hmacShaKeyFor(decoded); // valida >= 32 bytes
        }
        // Texto plano: exigir >= 32 bytes
        byte[] raw = secretProvided.getBytes(StandardCharsets.UTF_8);
        if (raw.length < 32) {
            throw new WeakKeyException("secret.key muy corta: " + raw.length +
                    " bytes. Para HS256 se requieren >= 32 bytes. Usa Base64 de 32+ bytes o un texto largo.");
        }
        return Keys.hmacShaKeyFor(raw);
    }

    /* ====== Claims helpers ====== */

    private Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) { return parse(token).getSubject(); }
    public Date extractExpiration(String token) { return parse(token).getExpiration(); }
    public String extractRole(String token) { return parse(token).get("role", String.class); }
    public String extractSingleRole(String token) { return extractRole(token); }

    private boolean isTokenExpired(String token) { return extractExpiration(token).before(new Date()); }

    public boolean validateToken(String token, UserDetails userDetails) {
        return userDetails.getUsername().equals(extractUsername(token)) && !isTokenExpired(token);
    }

    /* ====== Token creation ====== */

    private String createToken(Map<String,Object> claims, String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuer(issuer)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        Map<String,Object> claims = new HashMap<>();
        String role = userDetails.getAuthorities().stream()
                .findFirst().map(GrantedAuthority::getAuthority)
                .orElse("USER");
        claims.put("role", role);
        return createToken(claims, userDetails.getUsername());
    }
}