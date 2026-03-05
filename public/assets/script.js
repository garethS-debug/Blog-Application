let token = localStorage.getItem("authToken");

function openForm() {
  token = localStorage.getItem("authToken");
  const myForm = document.getElementById("myForm");
  const authContainer = document.getElementById("auth-container");
  if (!myForm) return;

  // remove any previous inline messages
  const oldMsg = document.getElementById("already-logged-in-msg");
  if (oldMsg) oldMsg.remove();

  // always show the popup frame
  myForm.style.display = "block";

  if (token) {
    // hide the login/register UI but keep it intact in DOM
    if (authContainer) authContainer.classList.add("hidden");

    // create a small inline message with actions
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
    // Not logged in — show the login/register UI
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
});

function validateForm(event) {
    if (event && event.preventDefault) { event.preventDefault(); }

    // use the same IDs as in public/assets/script.js
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
    loginBtn.addEventListener('click', validateForm);
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
  fetch("http://localhost:3001/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

      //  alert("User Logged In successfully");


        console.log("Login successful, token stored in localStorage:", token);
        createSuccessMessage();
        // Fetch the posts list
        fetchPosts();
       closeForm();
        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("http://localhost:3001/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}


function fetchPosts() {
  fetch("http://localhost:3001/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      posts.forEach((post) => 
        {
        const div = document.createElement("div");
        div.classList.add("card");
        const h2 = document.createElement("h2");
        h2.textContent = post.title;

        const h5 = document.createElement("h5");
        h5.textContent = `Title description, ${new Date(post.createdOn).toLocaleDateString()}`;
        
        const fakeimg = document.createElement("div");
        fakeimg.classList.add("fakeimg");
        fakeimg.style.height = "100px";
        fakeimg.textContent = "Image";
        div.appendChild(fakeimg);

        
        
        const p = document.createElement("p");
        p.textContent = post.content;
        div.appendChild(h2);
        div.appendChild(h5);
        div.appendChild(p);

        // div.innerHTML = `<h3>${post.title}</h3><p>${
        //   post.content
        // }</p><small>By: ${post.postedBy} on ${new Date(
        //   post.createdOn
        // ).toLocaleString()}</small>`;

        

        postsContainer.appendChild(div);
      });
    });
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
