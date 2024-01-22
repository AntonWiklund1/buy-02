package com.gritlabstudent.user.ms.config;

import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.User;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ValidateUser {
    public static void validateUser(User user) throws UserCollectionException {
        // trim each field
        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(user.getPassword().trim());
        user.setRole(user.getRole().trim());

        if (user.getName() != null) {
            user.setName(user.getName().trim());
        } else {
            throw new UserCollectionException("User name" + UserCollectionException.NullException());
        }
        // if product.getDescription() is not null, trim, else throw exception
        if (user.getEmail() != null) {
            boolean isValid = isValidEmail(user.getEmail());
            System.out.println(user.getEmail() + " is valid email: " + isValid);
            if (!isValid) {
                throw new UserCollectionException(UserCollectionException.InvalidEmailException());
            }
            user.setEmail(user.getEmail().trim());
        } else {
            throw new UserCollectionException("User email" + UserCollectionException.NullException());
        }
        if (user.getPassword() != null) {
            user.setPassword(user.getPassword().trim()); // Trim the ID field as well
        } else {
            throw new UserCollectionException("User password" + UserCollectionException.NullException());
        }

        if (user.getRole() != null) {
            // check if role enum is either user.getRole() is "ROLE_SELLER" or "ROLE_CLIENT"
            if (!(user.getRole().equals("ROLE_SELLER") || user.getRole().equals("ROLE_CLIENT"))) {
                throw new UserCollectionException("User role" + UserCollectionException.InvalidRoleException());
            }
            user.setRole(user.getRole().trim());
        } else {
            throw new UserCollectionException("User role" + UserCollectionException.NullException());
        }

    }

    public static boolean isValidDomainPart(String domainPart) {
        String[] parts = domainPart.split("\\.");
        for (String part : parts) {
            if (part.isEmpty()) {
                return false;
            }
            for (char c : part.toCharArray()) {
                if (!Character.isLetterOrDigit(c) && c != '-') {
                    return false;
                }
            }
        }
        return true;
    }
        
    private static final String BASIC_EMAIL_REGEX = "^[\\w-\\.]+@";
    private static final String TOP_LEVEL_DOMAIN_REGEX = "[\\w-]{2,4}$";

    public static boolean isValidEmail(String email) {

        int atIndex = email.lastIndexOf('@');
        if (atIndex == -1) {
            return false;
        }
        // Compile the regex pattern
        Pattern basicPattern = Pattern.compile(BASIC_EMAIL_REGEX);
        Pattern topLevelDomainPattern = Pattern.compile(TOP_LEVEL_DOMAIN_REGEX);

        // Match the input email against the pattern
        Matcher basicMatcher = basicPattern.matcher(email);

        Matcher topLevelDomainMatcher = topLevelDomainPattern.matcher(email);

        // Return true if it matches the pattern (valid format), false otherwise
        return basicMatcher.find() && topLevelDomainMatcher.find() &&isValidDomainPart(email.substring(atIndex + 1));
    }
}
