let token = localStorage.getItem("authToken");

function openForm() {
  token = localStorage.getItem("authToken");
  const myForm = document.getElementById("myForm");
  const authContainer = document.getElementById("auth-container");
  if (!myForm) return;

  const oldMsg = document.getElementById("already-logged-in-msg");
  if (oldMsg) oldMsg.remove();


  myForm.style.display = "block";

  if (token) {

    if (authContainer) authContainer.classList.add("hidden");

    const form = myForm.querySelector(".form-container");
    const msg = document.createElement("div");
    msg.id = "already-logged-in-msg";
    msg.innerHTML = `
      <div>You're already logged in.</div>
      <div style="margin-top:8px;">
        <button id="logout-inline" type="button">Logout</button>
        <button id="close-inline" type="button" style="margin-left:8px">Close</button>
      </div>`;
    form.prepend(msg);

    document.getElementById("logout-inline").addEventListener("click", OnClickLogOut);
    document.getElementById("close-inline").addEventListener("click", OnClickClose);
  } else {
    if (authContainer) authContainer.classList.remove("hidden");
  }
}
function OnClickLogOut(){
  logout();
  const msg = document.getElementById('already-logged-in-msg');
  if (msg) msg.remove();
  closeForm();
}


function OnClickClose(){
      const msg = document.getElementById('already-logged-in-msg');
      if (msg) msg.remove();
      closeForm();
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
     console.log('Close button clicked');
}

document.addEventListener('DOMContentLoaded', () => {
  const myForm = document.getElementById('myForm');
  if (myForm) closeForm();
  console.log('page loaded');
  updateAuthButton();
  if (localStorage.getItem('authToken')) {
    showAuthenticatedView();
  }
});

function validateForm(event) {
    if (event && event.preventDefault) { event.preventDefault(); }
    const emailInput = document.getElementById('login-email').value;
    const passwordInput = document.getElementById('login-password').value;

    console.log('Login button clicked');
    console.log('email input = ', emailInput);
    console.log('password input = ', passwordInput);

    login();
    
}

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) 
    {
  loginBtn.addEventListener('click', openForm);
    }




function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("http://localhost:3001/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  console.log('trying login');
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

      //  alert("User Logged In successfully");


        console.log("Login successful, token stored in localStorage:", token);
        createSuccessMessage();

        fetchPosts();
       closeForm();
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        updateAuthButton();

        // fetchPosts();
        // closeForm();
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  console.log('logout clicked');
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
    updateAuthButton();

    // document.getElementById("auth-container").classList.remove("hidden");
  });
}

function showAuthenticatedView() {
  console.log('open profile view');
  token = localStorage.getItem('authToken');
  console.log('token in profile view', token);
  document.getElementById("auth-container").classList.add("hidden");
  document.getElementById("app-container").classList.remove("hidden");
  fetchPosts();
  console.log('loading user posts');
  closeForm();

  // fetchPosts();
  // document.getElementById("auth-container").classList.remove("hidden");
}

function updateAuthButton() {
  console.log('updating auth button');
  const btn = document.getElementById("loginBtn");
  if (!btn) return;
  const isAuthed = !!localStorage.getItem("authToken");
  const newBtn = btn.cloneNode(true);
  newBtn.id = "loginBtn";
  newBtn.removeAttribute("onclick");
  newBtn.setAttribute("href", "javascript:void(0)");
  newBtn.textContent = isAuthed ? "Profile" : "Login";
  btn.parentNode.replaceChild(newBtn, btn);

  if (isAuthed) {
    newBtn.addEventListener("click", (e) => {
      console.log('profile clicked');
      e.preventDefault();
      showAuthenticatedView();

      // openForm();
    });
  } else {
    console.log('login mode button');
    newBtn.addEventListener("click", (e) => {
      console.log('login clicked from nav');
      e.preventDefault();
      openForm();

      // showAuthenticatedView();
    });

    // newBtn.addEventListener("click", openForm);
  }
}



function editPost(postID, button){
  if (!button) return;
  const card = button.closest(".card");
  if (!card) return;

  const isEditing = button.dataset.mode === "editing";

  if (isEditing) {
    const titleInput = card.querySelector(".edit-title");
    const contentInput = card.querySelector(".edit-content");
    if (!titleInput || !contentInput) return;

    confirmUpdate(postID, titleInput.value, contentInput.value);
    return;
  }

  const titleEl = card.querySelector("h2");
  const contentEl = card.querySelector("p");
  if (!titleEl || !contentEl) return;

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "edit-title";
  titleInput.value = titleEl.textContent || "";

  const contentInput = document.createElement("textarea");
  contentInput.className = "edit-content";
  contentInput.value = contentEl.textContent || "";

  card.replaceChild(titleInput, titleEl);
  card.replaceChild(contentInput, contentEl);

  button.textContent = "Submit";
  button.dataset.mode = "editing";
}



function confirmUpdate(postID, title, content) {
  
  fetch(`http://localhost:3001/api/posts/${postID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post updated successfully");
      fetchPosts();
    })
    .catch((err) => console.log(err));
  
}

function deletePost(postId) {
  fetch(`http://localhost:3001/api/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => 
    res.json()).then(() => {
      alert("Post deleted successfully");
      fetchPosts();
    });
}

function fetchPosts() {
 fetch("http://localhost:3001/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      console.log('fetching posts now');
      const postsContainer = document.querySelector("#app-container #posts");
      postsContainer.innerHTML = "";

      // const postsContainer = document.getElementById("posts");

      posts.forEach((post) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.setAttribute("data-post-id", post.id);

        const h2 = document.createElement("h2");
        h2.textContent = post.title;

        const h5 = document.createElement("h5");
        h5.textContent = `Title description, ${new Date(post.createdOn).toLocaleDateString()}`;

        const fakeimg = document.createElement("div");
        fakeimg.classList.add("fakeimg");
        fakeimg.style.height = "100px";
        fakeimg.textContent = "Image";

        const p = document.createElement("p");
        p.textContent = post.content;

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.dataset.mode = "view";
        editBtn.onclick = () => editPost(post.id, editBtn);

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => deletePost(post.id));

        div.appendChild(fakeimg);
        div.appendChild(h2);
        div.appendChild(h5);
        div.appendChild(p);
        div.appendChild(editBtn);
        div.appendChild(delBtn);

        postsContainer.appendChild(div);
      });
    })
    .catch((err) => console.log(err));
}



function createSuccessMessage(){

}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  fetch("http://localhost:3001/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: "User" }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
    });
}
