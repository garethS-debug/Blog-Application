// ...existing code...

const API_URL = "http://localhost:3001/api/posts";

async function fetchPosts() {
    const container = document.getElementById("posts");
    try {
        const res = await fetch(API_URL);
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.log("Error fetching posts:", err);
    }
}

function renderPosts(posts = []) {
  console.log("Rendering posts:", posts);
}

// auto-load posts on page load
window.addEventListener("DOMContentLoaded", fetchPosts);

// ...existing code...