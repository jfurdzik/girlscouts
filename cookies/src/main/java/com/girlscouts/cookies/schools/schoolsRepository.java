package com.girlscouts.cookies.schools;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {

    List<School> findByZipCode(String zipCode);

    List<School> findBySchoolType(SchoolType schoolType);

    List<School> findByAllowsFlyers(Boolean allowsFlyers);

}
