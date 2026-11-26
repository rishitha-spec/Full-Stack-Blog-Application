
package com.rishi.blog.controller;

import com.rishi.blog.entity.Post;
import com.rishi.blog.service.PostService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(
            @Valid @RequestBody Post post) {

        Post savedPost = postService.createPost(post);

        return ResponseEntity.ok(savedPost);
    }

    // Get all posts of the logged-in user
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {

        return ResponseEntity.ok(
                postService.getAllPosts()
        );
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                postService.getPostById(id)
        );
    }

    // Update a post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody Post post) {

        return ResponseEntity.ok(
                postService.updatePost(id, post)
        );
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long id) {

        postService.deletePost(id);

        return ResponseEntity.ok(
                "Post deleted successfully!"
        );
    }
}
