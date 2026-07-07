package com.girlscouts.cookies.email;

import java.util.Map;

/** Tiny {placeholder} substitution — intentionally not a templating engine dependency. */
public class TemplateUtil {

    public static String render(String template, Map<String, String> values) {
        if (template == null) return "";
        String result = template;
        for (var entry : values.entrySet()) {
            result = result.replace("{" + entry.getKey() + "}", entry.getValue() == null ? "" : entry.getValue());
        }
        return result;
    }
}
