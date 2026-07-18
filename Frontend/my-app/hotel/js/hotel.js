// Simple booking interactions for hotel page
document.getElementById('yr').textContent = new Date().getFullYear();

function bookNow(hotelName){
  const confirmed = confirm('Book a room at ' + hotelName + '? You will be redirected to the booking page.');
  if(confirmed){
    // For now redirect to trip-single or a placeholder; adapt later to a real booking flow
    window.location.href = '../trip-single.html';
  }
}

function viewDetails(e, hotelName){
  e.preventDefault();
  alert(hotelName + '\n\nThis is a sample hotel entry. Replace with full details or link to a hotel detail page.');
}

// --- Auth (client-side demo) ---------------------------------------------
function isLoggedIn(){
  return localStorage.getItem('loggedIn') === 'true';
}

function setLoggedIn(val){
  localStorage.setItem('loggedIn', val ? 'true' : 'false');
  updateAuthUI();
}

function updateAuthUI(){
  const authLink = document.getElementById('auth-link');
  if(!authLink) return;
  if(isLoggedIn()){
    authLink.textContent = 'Logout';
    authLink.href = '#';
    authLink.onclick = function(e){
      e.preventDefault();
      // perform logout
      setLoggedIn(false);
      alert('You have been logged out.');
    };
  } else {
    authLink.textContent = 'Login';
    authLink.href = '../login.html';
    authLink.onclick = null; // let normal navigation occur
  }
}

// initialize auth UI when DOM is ready
document.addEventListener('DOMContentLoaded', function(){
  updateAuthUI();
});
