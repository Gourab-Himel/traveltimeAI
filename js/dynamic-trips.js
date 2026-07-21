/**
 * Dynamic Trips Loader (robust)
 * - Fetches trips from API or falls back to DataStore
 * - Classifies trips into Past, Current, Upcoming
 * - Handles missing/partial dates and formats prices (৳)
 */

document.addEventListener('DOMContentLoaded', () => {
	loadAndRenderTrips().catch(err => console.error('dynamic-trips error (DOMContentLoaded):', err));
});

// If script is loaded after DOMContentLoaded fired, run immediately
if (document.readyState !== 'loading') {
	loadAndRenderTrips().catch(err => console.error('dynamic-trips error (immediate):', err));
}

async function loadAndRenderTrips(){
	const currentContainer = document.getElementById('current-trips-container');
	const upcomingContainer = document.getElementById('upcoming-trips-container');
	const pastContainer = document.getElementById('past-trips-container');

	if(!currentContainer || !upcomingContainer || !pastContainer){
		console.warn('Trip containers not found in DOM');
		return;
	}

	let trips = [];
	try{
		const res = await fetch('/api/trips');
		if(res.ok) trips = await res.json();
		else throw new Error('API returned non-OK');
	}catch(e){
		// fallback to DataStore if present
		if (typeof DataStore !== 'undefined') trips = DataStore.getTrips();
		else {
			console.warn('No API and no DataStore available');
			trips = [];
		}
	}

	// Normalize trips array
	if(!Array.isArray(trips)) trips = [];

	// Clear existing content
	currentContainer.innerHTML = '';
	upcomingContainer.innerHTML = '';
	pastContainer.innerHTML = '';

	const today = new Date();
	today.setHours(0,0,0,0);

	let count = { current:0, upcoming:0, past:0 };

	// safety: if something blocks rendering, clear loaders after 1.5s
	const safetyTimer = setTimeout(() => {
		if(count.current === 0) currentContainer.innerHTML = '<div class="col-12 text-center"><p>No current trips found (timeout).</p></div>';
		if(count.upcoming === 0) upcomingContainer.innerHTML = '<div class="col-12 text-center"><p>No upcoming trips found (timeout).</p></div>';
		if(count.past === 0) pastContainer.innerHTML = '<div class="col-12 text-center"><p>No past trips found (timeout).</p></div>';
	}, 1500);

	trips.forEach(trip => {
		const { status, startDate, endDate } = classifyTripDates(trip, today);
		const card = createTripCard(trip, status, startDate, endDate);

		if(status === 'past'){
			pastContainer.insertAdjacentHTML('beforeend', card);
			count.past++;
		} else if(status === 'upcoming'){
			upcomingContainer.insertAdjacentHTML('beforeend', card);
			count.upcoming++;
		} else {
			currentContainer.insertAdjacentHTML('beforeend', card);
			count.current++;
		}
	});

	clearTimeout(safetyTimer);
	if(count.current === 0) currentContainer.innerHTML = '<div class="col-12 text-center"><p>No current trips happening right now.</p></div>';
	if(count.upcoming === 0) upcomingContainer.innerHTML = '<div class="col-12 text-center"><p>No upcoming trips scheduled.</p></div>';
	if(count.past === 0) pastContainer.innerHTML = '<div class="col-12 text-center"><p>No past trips found.</p></div>';
}

// Classify trip into 'past'|'current'|'upcoming'
function classifyTripDates(trip, today){
	// parse dates safely and normalize to start of day
	function parseSafe(d){
		if(!d) return null;
		const dt = new Date(d);
		if(isNaN(dt)) return null;
		dt.setHours(0,0,0,0);
		return dt;
	}

	let start = parseSafe(trip.startDate);
	let end = parseSafe(trip.endDate);

	// If only one date provided, treat it as single-day trip
	if(start && !end) end = new Date(start);
	if(end && !start) start = new Date(end);

	// If both missing, treat as upcoming (undated offerings)
	if(!start && !end) return { status: 'upcoming', startDate: null, endDate: null };

	// Now compare using normalized start/end
	if(end < today) return { status: 'past', startDate: start, endDate: end };
	if(start > today) return { status: 'upcoming', startDate: start, endDate: end };
	// otherwise it's current (start <= today <= end)
	return { status: 'current', startDate: start, endDate: end };
}

// Format price to Taka string; accepts numbers in BDT or USD if currency provided.
function formatPriceToTaka(price, currency){
	if(price == null) return '৳ 0';
	const RATE = 100; // 1 USD = 100 Tk (adjustable)
	let val = Number(price);
	if(isNaN(val)) val = 0;
	if(currency && String(currency).toUpperCase() === 'USD') val = Math.round(val * RATE);
	// If currency not provided, assume values <= 500 are USD amounts and convert
	else if(!currency && val <= 500) val = Math.round(val * RATE);
	// format with commas
	try{ return '৳ ' + val.toLocaleString(); }catch(e){ return '৳ ' + val; }
}

function createTripCard(trip, status, startDate, endDate){
	const img = trip.image || 'images/img_1.jpg';
	const title = trip.title || 'Untitled Trip';
	const id = trip.id || '';
	const location = trip.location || '';
	const priceText = formatPriceToTaka(trip.price, trip.currency);

	let badge = '';
	if(status === 'past') badge = '<span class="badge badge-secondary mb-2">Past</span>';
	else if(status === 'upcoming') badge = '<span class="badge badge-primary mb-2">Upcoming</span>';
	else badge = '<span class="badge badge-success mb-2">Current</span>';

	const startStr = startDate ? startDate.toISOString().slice(0,10) : 'TBD';
	const endStr = endDate ? endDate.toISOString().slice(0,10) : 'TBD';

	return `
	<div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
		<div class="listing-item">
			<div class="listing-image">
				<img src="${img}" alt="${escapeHtml(title)}" class="img-fluid" style="height: 200px; object-fit: cover; width: 100%;">
			</div>
			<div class="listing-item-content">
				${badge}
				<a class="px-3 mb-3 category bg-primary" href="#">${priceText}</a>
				<h2 class="mb-1"><a href="trip-single.html?id=${encodeURIComponent(id)}">${escapeHtml(title)}</a></h2>
				<p class="mb-0 text-white small">${startStr} - ${endStr}</p>
				<p class="text-white small">${escapeHtml(location)}</p>
			</div>
		</div>
	</div>
	`;
}

function escapeHtml(str){
	if(!str) return '';
	return String(str).replace(/[&<>"'`]/g, function(s){
		return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',"`":'&#96;'})[s];
	});
}
*** End Patch
