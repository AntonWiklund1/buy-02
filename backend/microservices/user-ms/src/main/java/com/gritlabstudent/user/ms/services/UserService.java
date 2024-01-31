package com.gritlabstudent.user.ms.services;

import com.gritlabstudent.user.ms.config.ValidateUser;
import com.gritlabstudent.user.ms.exceptions.UserCollectionException;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.models.UserDTO;
import com.gritlabstudent.user.ms.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.ConstraintViolationException;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    public UserDTO convertToUserDTO(User user) {
        var userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setRole(user.getRole());
        userDTO.setAvatarImagePath(user.getAvatarImagePath());
        userDTO.setTotalAmountSpent(user.getTotalAmountSpent());
        userDTO.setFavoriteProducts(user.getFavoriteProducts());
        userDTO.setTotalAmountGained(user.getTotalAmountGained());
        return userDTO;
    }

    public UserDTO createUser(User user)
            throws ConstraintViolationException, UserCollectionException {
        ValidateUser.validateUser(user);
        Optional<User> userOptional = userRepository.findByName(user.getName());
        if (userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.UserAlreadyExistException());
        }
        Optional<User> userEmailOptional = userRepository.findByEmail(user.getEmail());
        if (userEmailOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.UserAlreadyExistException());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        // get userDTO
        return convertToUserDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream().map(this::convertToUserDTO).collect(Collectors.toList());
    }

    public UserDTO getUserById(String id) {
        Optional<User> optionalUser = userRepository.findById(id);
        return optionalUser.map(this::convertToUserDTO).orElse(null);
    }

    // Get all user emails in a list
    public List<String> getAllUserEmails() {
        return userRepository.findAll().stream()
                .map(User::getEmail)
                .collect(Collectors.toList());
    }

    // Update User
    public User updateUser(String id, User updatedUser)
            throws ConstraintViolationException, UserCollectionException, NoSuchAlgorithmException {
        ValidateUser.validateUser(updatedUser);
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        }
        updatedUser.setId(id);
        updatedUser.setName(updatedUser.getName());
        updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        updatedUser.setRole(updatedUser.getRole());
        updatedUser.setEmail(updatedUser.getEmail());

        return userRepository.save(updatedUser);

    }

    // Delete User
    public void deleteUser(String id) throws UserCollectionException {
        Optional<User> userOptional = userRepository.findById(id);
        System.out.println("userOptional: " + userOptional);

        if (!userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        } else {
            // Now delete the user
            userRepository.deleteById(id);

        }
    }

    public boolean checkUserCredentials(String username, String password) {
        Optional<User> userOptional = userRepository.findByName(username);
        return userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword());
    }

    public String uploadUserAvatar(String id, MultipartFile avatarFile) throws IOException, UserCollectionException {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            throw new UserCollectionException(UserCollectionException.NotFoundException(id));
        }

        User user = userOptional.get();
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(avatarFile.getOriginalFilename()));

        // Construct the relative file path
        String relativeFilePath = "media/avatars/" + fileName;
        Path filePath = Paths.get(relativeFilePath);

        // Ensure directory exists
        Files.createDirectories(filePath.getParent());

        // Save the file on the server
        Files.copy(avatarFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update the user entity with the relative file path
        user.setAvatarImagePath(relativeFilePath);
        userRepository.save(user);

        // Return the URL
        return relativeFilePath;
    }

    public boolean checkUserExistence(String userId) {
        System.out.println("Checking user existence for ID: " + userId);
        return userRepository.existsById(userId);
    }

    public void updateUserTotalAmount(String id, BigDecimal amount) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setTotalAmountSpent(user.getTotalAmountSpent().add(amount));
            userRepository.save(user);
        }
    }

    public void updateUserFavoriteProduct(String id, String productId) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getFavoriteProducts() == null) {
                user.setFavoriteProducts(new ArrayList<>());
            }
            if (!user.getFavoriteProducts().contains(productId)) {
                user.getFavoriteProducts().add(productId);
                userRepository.save(user);
            }
        }
    }


    public void deleteUserFavoriteProduct(String id, String productId) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getFavoriteProducts() != null) {
                user.getFavoriteProducts().remove(productId);
                userRepository.save(user);
            }
        }
    }

    public void updateSellerEarnings(String id, BigDecimal earnings) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            BigDecimal currentEarnings = user.getTotalAmountGained();
            user.setTotalAmountGained(currentEarnings.add(earnings));
            userRepository.save(user);
        }
    }
}
