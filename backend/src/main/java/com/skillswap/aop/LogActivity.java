package com.skillswap.aop;

import java.lang.annotation.*;

/**
 * Marks a method whose execution should be recorded in the activity feed
 * and timed. Used by ActivityLoggingAspect.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogActivity {
    String action(); // human readable action name, e.g. "MATCH_CREATED"
}
