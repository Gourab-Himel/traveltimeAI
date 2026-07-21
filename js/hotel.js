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
