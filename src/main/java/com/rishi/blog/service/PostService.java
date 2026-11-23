
package com.rishi.blog.service;

import com.rishi.blog.entity.Post;
import com.rishi.blog.repository.PostRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Create a new blog post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Get all blog posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get a single post by ID
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Post not found with ID: " + id));
    }

    // Update an existing blog post
    public Post updatePost(Long id, Post updatedPost) {

        Post existingPost = getPostById(id);

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    // Delete a blog post
    public void deletePost(Long id) {

        Post existingPost = getPostById(id);

        postRepository.delete(existingPost);
    }
}
