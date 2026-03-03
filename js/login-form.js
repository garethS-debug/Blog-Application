function openForm() {
  document.getElementById("myForm").style.display = "block";
   console.log('Close button clicked');
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
     console.log('Close button clicked');
}


function validateForm(event) {
   // if (event && event.preventDefault) {event.preventDefault()};
    
    const emailInput = document.getElementById('email_id').value
    const passwordInput = document.getElementById('pswd_id').value

    console.log('Login button clicked');
    console.log('email input = ', emailInput)
    console.log('password input = ', passwordInput)
    
}

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) 
    {
    loginBtn.addEventListener('click', validateForm);
    }