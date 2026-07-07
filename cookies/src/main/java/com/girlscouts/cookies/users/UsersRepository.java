package com.girlscouts.cookies.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long>{

    List<Users> findByRole(Role role);

    List<Users>findByServiceUnit(String serviceUnit);

    Optional<Users> findByUsername(String username);

    Optional<Users> findByEmail(String email);

}