function openForm() {
  document.getElementById("myForm").style.display = "block";
   console.log('Close button clicked');
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
     console.log('Close button clicked');
}


function validateForm(event) {
    if (event && event.preventDefault) event.preventDefault();
    console.log('Login button clicked');
}

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', validateForm);
}