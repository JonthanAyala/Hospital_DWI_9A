package utez.edu.mx.hospitalback.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {

    public static String encodePassword(String rawPassword) {
        return new BCryptPasswordEncoder().encode(rawPassword);
    }

    public static boolean verifyPassword(String rawPassword, String encodedPassword) {
        return new BCryptPasswordEncoder().matches(rawPassword, encodedPassword);
    }

    /*public static void main(String[] args) {
        String rawPassword = "david123";
        String encodedPassword = encodePassword(rawPassword);
        String encodedPassword2 = encodePassword(rawPassword);
        System.out.println("Encoded Password: " + encodedPassword);
        boolean isMatch = verifyPassword(rawPassword, encodedPassword);
        System.out.println("Password matches: " + isMatch);
        boolean isMatch2 = verifyPassword(rawPassword, encodedPassword2);
        System.out.println("Password matches: " + isMatch2);
        boolean isMatch3 = verifyPassword(rawPassword, "$2a$10$uERrkH3dbYCywVIrczhGVuiC4/cTlMsSV.iIcHwNeG6toauVYV.SC");
        System.out.println("Password matches with hardcoded: " + isMatch3);
    }*/

}
