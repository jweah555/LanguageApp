package com.language.LanguageApp.Users;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    //Get All Users
    /**
     * 
     * @return
     */
    public Object getUsers() {
        return usersRepository.findAll();
    }

    //Get user by Id
    /**
     * 
     * @param userId
     * @return
     */
    public Object getUserById(@PathVariable long userId){
        return usersRepository.findById(userId).orElse(null);
    }

    //Get user by language
    /**
     * @param language
     * 
     */
    public Object getUsersByLanguage(String language ) {
        return usersRepository.findByLanguage(language);
    }

    //Get user by FirstName
    /**
     * @param firstName
     */
    public Object getUsersByFirstName(String firstName) {
        return usersRepository.findByFirstName(firstName);
    }

    //Add User
    /**
     * @param users
     */
    public Users addUser(Users users) {
        return usersRepository.save(users);
    }

    //Update User
    /**
     * @param users
     * @param usersId
     */
    public Users updateUsers(Users users, Users usersId) {
        return usersRepository.save(users);
    }
    

    //Delete User
    /**
     * @param users
     * @param usersId
     */

    public void deleteUsers(Long usersId) {
         usersRepository.deleteById(usersId);
    }
    








}
