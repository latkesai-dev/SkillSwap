package com.skillswap.aop;

import java.lang.annotation.*;

/**
 * Marks a method as rate limited per authenticated user.
 * Enforced by RateLimitAspect using a simple in-memory token bucket.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {
    int maxRequests() default 10;
    int windowSeconds() default 60;
}
