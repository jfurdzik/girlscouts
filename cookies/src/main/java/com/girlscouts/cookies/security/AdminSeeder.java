package com.girlscouts.cookies.security;

import com.girlscouts.cookies.users.Role;
import com.girlscouts.cookies.users.Users;
import com.girlscouts.cookies.users.UsersRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Once /api/users is locked to managers-only, there'd be no way to create the
 * very first manager account. This creates exactly one bootstrap ADMIN user on
 * startup if the users table is empty, using credentials from environment
 * variables (see README/summary for ADMIN_USERNAME / ADMIN_PASSWORD).
 *
 * This intentionally only ever seeds when the table is completely empty — it
 * will not reset or recreate an admin account that already exists, and it's
 * not a general-purpose "reset password" mechanism.
 */
@Component
public class AdminSeeder implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:changeme}")
    private String adminPassword;

    public AdminSeeder(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usersRepository.count() > 0) return;

        Users admin = new Users();
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setUsername(adminUsername);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        usersRepository.save(admin);

        System.out.println("Seeded initial admin account (username: " + adminUsername + "). " +
                "Set ADMIN_USERNAME/ADMIN_PASSWORD env vars to override, and change the password after first login.");
    }
}
