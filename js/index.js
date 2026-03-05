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

        const title = document.createElement("h2");
        title.textContent = post.title || "Default Title - No Title Provided";
        card.appendChild(title);

        const meta = document.createElement("h5");
        const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "";
        meta.textContent = `${post.summary || ""}${date ? ", " + date : ""}`;
        card.appendChild(meta);



        left.appendChild(card);
    });

    row.appendChild(left);
    container.appendChild(row);
}

// auto-load posts on page load
window.addEventListener("DOMContentLoaded", fetchPosts);

// ...existing code...