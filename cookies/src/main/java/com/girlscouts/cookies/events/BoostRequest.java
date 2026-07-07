package com.girlscouts.cookies.events;

/**
 * audience: ALL | SERVICE_UNIT | SCHOOL | PREVIOUS
 * value: required for SERVICE_UNIT (service unit code) and SCHOOL (school id as string); ignored otherwise
 */
public record BoostRequest(String audience, String value) {}
