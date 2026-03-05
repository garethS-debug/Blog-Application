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
    const container = document.getElementById("posts");
    container.innerHTML = "";

    const row = document.createElement("div");
    row.className = "row";

    const left = document.createElement("div");
    left.className = "leftcolumn";

    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "card";

   

        left.appendChild(card);
    });

    row.appendChild(left);
    container.appendChild(row);
}

// auto-load posts on page load
window.addEventListener("DOMContentLoaded", fetchPosts);

// ...existing code...