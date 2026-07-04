package com.skillswap.aop;

import com.skillswap.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory sliding-window rate limiter, keyed per user per method.
 * Demonstrates AOP enforcing cross-cutting policy without touching
 * controller/service business logic.
 */
@Aspect
@Component
public class RateLimitAspect {

    private record Bucket(AtomicInteger count, long windowStart) {}

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Around("@annotation(com.skillswap.aop.RateLimited)")
    public Object enforce(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimited limit = method.getAnnotation(RateLimited.class);

        String identity = "anonymous";
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            identity = user.getEmail();
        }

        String key = identity + ":" + method.getName();
        long now = System.currentTimeMillis();
        long windowMs = limit.windowSeconds() * 1000L;

        Bucket bucket = buckets.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStart() > windowMs) {
                return new Bucket(new AtomicInteger(0), now);
            }
            return existing;
        });

        int current = bucket.count().incrementAndGet();
        if (current > limit.maxRequests()) {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                attrs.getResponse().setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            }
            throw new RuntimeException("Rate limit exceeded. Try again later.");
        }

        return joinPoint.proceed();
    }
}
