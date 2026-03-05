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
function changedCategory(category) {
  console.log('category selected', category);
}

function setupCategoryListener() {
  document.getElementById('category-filter').addEventListener('change', function(e){
    changedCategory(e.target.value);
  });
}


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function renderPosts(posts = []) {
    const container = document.getElementById("posts");
    const row = document.createElement("div");
    const left = document.createElement("div");
    
    left.className = "leftcolumn";
    row.className = "row";
    container.innerHTML = "";


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

        const imgDiv = document.createElement("div");
        imgDiv.className = "fakeimg";
        imgDiv.style.height = "200px";
        imgDiv.textContent = "Image";
        card.appendChild(imgDiv);

        const content = document.createElement("p");
        const text = post.content || "";
        content.textContent = text.length > 300 ? text.slice(0, 300) + "..." : text;
        card.appendChild(content);

        left.appendChild(card);
    });

    row.appendChild(left);
    container.appendChild(row);
}

function listenForCatSelection() {
  const dropdown = document.getElementById("myDropdown");
  const links = dropdown.getElementsByTagName("a");
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function() {
    console.log(this.textContent.trim());
    });
  }
}

const catFilter = document.getElementById('category-filter');
if (catFilter) catFilter.addEventListener('change', (e) => {
  changedCategory(e.target.value);
});

window.addEventListener('DOMContentLoaded', function() {
 // setupCategoryListener();
//  dropdownSelection();
  listenForCatSelection();
  fetchPosts();
});

