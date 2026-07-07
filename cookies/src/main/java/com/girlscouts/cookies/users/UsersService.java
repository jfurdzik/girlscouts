package com.girlscouts.cookies.users;

import com.girlscouts.cookies.exceptions.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsersService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElseThrow(() -> new com.girlscouts.cookies.exceptions.EntityNotFoundException("User not found"));
    }

    public Users createUser(Users user) {
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return usersRepository.save(user);
    }


    public Users updateUser(Long id, Users updatedUser) {

        Users user = getUserById(id);
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setRole(updatedUser.getRole());
        user.setServiceUnit(updatedUser.getServiceUnit());
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        // Only touch the password if a new one was actually provided.
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        return usersRepository.save(user);
    }


    public void deleteUser(Long id) {
        Users user = getUserById(id);
        usersRepository.delete(user);
    }


    public List<Users> getUsersByRole(Role role) {
        return usersRepository.findByRole(role);
    }

    public List<Users> getUsersByServiceUnit(String serviceUnit) {
        return usersRepository.findByServiceUnit(serviceUnit);
    }


}