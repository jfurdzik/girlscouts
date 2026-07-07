package com.girlscouts.cookies.schools;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public SchoolService(SchoolRepository schoolRepository) {
        this.schoolRepository = schoolRepository;
    }

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School getSchoolById(Long id) {
        return schoolRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("School not found"));
    }

    public School createSchool(School school) {
        return schoolRepository.save(school);
    }

    public School updateSchool(Long id, School updatedSchool) {

        School school = getSchoolById(id);

        school.setSchoolName(updatedSchool.getSchoolName());
        school.setAddress(updatedSchool.getAddress());
        school.setZipCode(updatedSchool.getZipCode());
        school.setSchoolType(updatedSchool.getSchoolType());
        school.setAllowsFlyers(updatedSchool.getAllowsFlyers());
        //school.setContactName(updatedSchool.getContactName());
        school.setContactEmail(updatedSchool.getContactEmail());
        school.setContactPhone(updatedSchool.getContactPhone());
        school.setNotes(updatedSchool.getNotes());

        return schoolRepository.save(school);
    }

    public void deleteSchool(Long id) {
        schoolRepository.deleteById(id);
    }

    public List<School> getSchoolsByZipCode(String zipCode) {
        return schoolRepository.findByZipCode(zipCode);
    }

    public List<School> getSchoolsByType(SchoolType type) {
        return schoolRepository.findBySchoolType(type);
    }

    public List<School> getSchoolsAllowingFlyers() {
        return schoolRepository.findByAllowsFlyers(true);
    }
}
