
package com.rishi.blog.service;

import com.rishi.blog.entity.Post;
import com.rishi.blog.entity.User;
import com.rishi.blog.exception.PostNotFoundException;
import com.rishi.blog.repository.PostRepository;
import com.rishi.blog.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    public Post createPost(Post post) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found"));

        post.setUser(user);

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findByUserEmail(
                getCurrentUserEmail());
    }

    public Post getPostById(Long id) {

        String email = getCurrentUserEmail();

        return postRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() ->
                    new PostNotFoundException(
                        "Post not found with ID: " + id));
    }

    public Post updatePost(Long id, Post updatedPost) {

        Post existingPost = getPostById(id);

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {

        Post existingPost = getPostById(id);

        postRepository.delete(existingPost);
    }
}
