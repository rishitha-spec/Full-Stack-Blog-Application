
package com.rishi.blog.repository;

import com.rishi.blog.entity.Post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Find posts belonging to a particular user
    List<Post> findByUserEmail(String email);

    // Find a post only if it belongs to the given user
    Optional<Post> findByIdAndUserEmail(Long id, String email);
}
