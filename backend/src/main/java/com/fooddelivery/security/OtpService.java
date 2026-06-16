package com.fooddelivery.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final String OTP_PREFIX = "otp:";
    private static final String OTP_ATTEMPT_PREFIX = "otp_attempt:";

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender mailSender;

    @Value("${otp.ttl-minutes}")
    private int otpTtlMinutes;

    @Value("${otp.length}")
    private int otpLength;

    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(RedisTemplate<String, Object> redisTemplate, JavaMailSender mailSender) {
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSender;
    }

    public String generateOtp(String email) {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        String otpCode = otp.toString();

        String key = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(key, otpCode, otpTtlMinutes, TimeUnit.MINUTES);

        log.info("OTP generated for {}: {}", email, otpCode);

        return otpCode;
    }

    public boolean verifyOtp(String email, String otpCode) {
        String attemptKey = OTP_ATTEMPT_PREFIX + email;
        Integer attempts = (Integer) redisTemplate.opsForValue().get(attemptKey);
        if (attempts == null) {
            attempts = 0;
        }
        if (attempts >= 5) {
            log.warn("Too many OTP attempts for {}", email);
            return false;
        }

        String key = OTP_PREFIX + email;
        String storedOtp = (String) redisTemplate.opsForValue().get(key);

        if (storedOtp != null && storedOtp.equals(otpCode)) {
            redisTemplate.delete(key);
            redisTemplate.delete(attemptKey);
            return true;
        }

        redisTemplate.opsForValue().set(attemptKey, attempts + 1, otpTtlMinutes, TimeUnit.MINUTES);
        return false;
    }

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Food Delivery - OTP Verification");
            message.setText("Your OTP for login is: " + otp + "\n\nThis OTP is valid for "
                    + otpTtlMinutes + " minutes.\n\nThank you,\nFood Delivery Team");
            mailSender.send(message);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send OTP email");
        }
    }
}