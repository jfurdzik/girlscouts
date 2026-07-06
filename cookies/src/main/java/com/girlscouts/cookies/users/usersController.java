package com.girlscouts.cookies.users;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UsersController {

    private final UsersService usersService;

    public UsersController(UsersService usersService) {
        this.usersService = usersService;
    }

    @GetMapping
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Users getUserById(@PathVariable Long id) {
        return usersService.getUserById(id);
    }

    @PostMapping
    public Users createUser(@RequestBody Users user) {
        return usersService.createUser(user);
    }

    @PutMapping("/{id}")
    public Users updateUser(
            @PathVariable Long id,
            @RequestBody Users user) {
        return usersService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        usersService.deleteUser(id);
    }

    @GetMapping("/role/{role}")
    public List<Users> getUsersByRole(@PathVariable Role role) {
        return usersService.getUsersByRole(role);
    }

    @GetMapping("/service-unit/{serviceUnit}")
    public List<Users> getUsersByServiceUnit(
            @PathVariable String serviceUnit) {
        return usersService.getUsersByServiceUnit(serviceUnit);
    }
}