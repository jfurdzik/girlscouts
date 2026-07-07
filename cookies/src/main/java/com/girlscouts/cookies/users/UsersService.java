package com.girlscouts.cookies.users;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsersService {

    private final UsersRepository usersRepository;

    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Users createUser(Users user) {
        return usersRepository.save(user);
    }


    public Users updateUser(Long id, Users updatedUser) {

        Users user = getUserById(id);
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setRole(updatedUser.getRole());
        user.setServiceUnit(updatedUser.getServiceUnit());
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