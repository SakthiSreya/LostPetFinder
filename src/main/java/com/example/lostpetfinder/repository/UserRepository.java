package com.example.lostpetfinder.repository;

import com.example.lostpetfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}