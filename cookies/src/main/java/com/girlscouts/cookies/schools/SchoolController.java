package com.girlscouts.cookies.schools;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
@CrossOrigin(origins = "*")
public class SchoolController {

    private final SchoolService schoolService;

    public SchoolController(SchoolService schoolService) {
        this.schoolService = schoolService;
    }

    @GetMapping
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping("/{id}")
    public School getSchoolById(@PathVariable Long id) {
        return schoolService.getSchoolById(id);
    }

    @PostMapping
    public School createSchool(@RequestBody School school) {
        return schoolService.createSchool(school);
    }

    @PutMapping("/{id}")
    public School updateSchool(
            @PathVariable Long id,
            @RequestBody School school) {
        return schoolService.updateSchool(id, school);
    }

    @DeleteMapping("/{id}")
    public void deleteSchool(@PathVariable Long id) {
        schoolService.deleteSchool(id);
    }

    @GetMapping("/zipcode/{zipCode}")
    public List<School> getSchoolsByZipCode(
            @PathVariable String zipCode) {

        return schoolService.getSchoolsByZipCode(zipCode);
    }

//    @GetMapping("/service-unit/{serviceUnit}")
//    public List<School> getSchoolsByServiceUnit(
//            @PathVariable String serviceUnit) {
//
//        return schoolService.getSchoolsByServiceUnit(serviceUnit);
//    }

    @GetMapping("/type/{type}")
    public List<School> getSchoolsByType(
            @PathVariable SchoolType type) {

        return schoolService.getSchoolsByType(type);
    }

    @GetMapping("/flyers")
    public List<School> getSchoolsAllowingFlyers() {
        return schoolService.getSchoolsAllowingFlyers();
    }
}