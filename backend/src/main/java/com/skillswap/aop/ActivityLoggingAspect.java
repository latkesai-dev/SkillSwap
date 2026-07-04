package com.skillswap.aop;

import com.skillswap.entity.ActivityLog;
import com.skillswap.entity.User;
import com.skillswap.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * Intercepts every method annotated with @LogActivity, times its execution,
 * and persists an ActivityLog row. This powers the "recent activity" feed
 * on the dashboard without scattering logging code through the services.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class ActivityLoggingAspect {

    private final ActivityLogRepository activityLogRepository;

    @Around("@annotation(com.skillswap.aop.LogActivity)")
    public Object logActivity(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        LogActivity annotation = method.getAnnotation(LogActivity.class);

        String username = "anonymous";
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            username = user.getEmail();
        }

        Object result;
        try {
            result = joinPoint.proceed();
        } finally {
            long durationMs = System.currentTimeMillis() - start;
            ActivityLog log = ActivityLog.builder()
                    .username(username)
                    .action(annotation.action())
                    .details(method.getName() + " executed")
                    .executionTimeMs(durationMs)
                    .build();
            activityLogRepository.save(log);
        }
        return result;
    }
}
