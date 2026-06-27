package com.kisanurea.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    private static final String SECRET = "kisanurea_jwt_secret_key_that_is_long_enough_for_hmac_sha256_1234567890";
    private static final String ISSUER = "kisanurea";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in ms
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET);
    private static final JWTVerifier VERIFIER = JWT.require(ALGORITHM).withIssuer(ISSUER).build();

    public String generateToken(String id, String phone, String role, String name) {
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(phone)
                .withClaim("id", id)
                .withClaim("role", role)
                .withClaim("name", name)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(ALGORITHM);
    }

    public DecodedJWT verifyToken(String token) {
        return VERIFIER.verify(token);
    }

    public String getPhone(DecodedJWT jwt) {
        return jwt.getSubject();
    }

    public String getRole(DecodedJWT jwt) {
        return jwt.getClaim("role").asString();
    }

    public String getName(DecodedJWT jwt) {
        return jwt.getClaim("name").asString();
    }

    public String getId(DecodedJWT jwt) {
        return jwt.getClaim("id").asString();
    }
}
