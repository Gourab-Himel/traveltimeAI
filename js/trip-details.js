document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get('id');

    if (!tripId) {
        // Redirect to trips page if no ID provided
        window.location.href = 'trips.html';
        return;
    }

    async function loadTripDetails() {
        let trip = null;
        try {
            const response = await fetch(`/api/trips/${tripId}`);
            if (!response.ok) throw new Error('Trip not found or API offline');
            trip = await response.json();
        } catch (error) {
            console.warn('API failed, trying fallback...');
            if (typeof DataStore !== 'undefined') {
                trip = DataStore.getTripById(tripId);
            }
        }

        if (trip) {
            renderTrip(trip);
            loadReviews(tripId);
            setupReviewForm(tripId);
        } else {
            document.querySelector('.site-section').innerHTML = '<div class="container text-center"><h2>Trip not found</h2><a href="trips.html" class="btn btn-primary mt-3">Back to Trips</a></div>';
        }
    }

    function renderTrip(trip) {
        // Update Title
        const titleEls = document.querySelectorAll('.trip-title');
        titleEls.forEach(el => el.textContent = trip.title);

        // Update Price
        const priceEl = document.getElementById('trip-price');
        // DB is BDT
        if (priceEl) priceEl.textContent = '৳' + Number(trip.price).toLocaleString('en-BD');

        // Update Description
        const descEl = document.getElementById('trip-description');
        if (descEl) descEl.innerHTML = `<p>${trip.description}</p>`;

        // Update Category
        const catEl = document.getElementById('trip-category');
        if (catEl) catEl.textContent = trip.category || 'Package';

        // Update Background Image
        const heroEl = document.querySelector('.site-section-cover');
        if (heroEl) heroEl.style.backgroundImage = `url('${trip.image}')`;
    }

    async function loadReviews(id) {
        try {
            const res = await fetch(`/api/reviews/${id}`);
            const reviews = await res.json();
            const container = document.getElementById('reviews-container');

            if (reviews.length > 0) {
                container.innerHTML = reviews.map(r => `
                    <div class="review-item border-bottom mb-3 pb-3">
                        <div class="d-flex justify-content-between">
                            <strong>${r.username || 'Anonymous'}</strong>
                            <span class="text-warning">${'⭐'.repeat(r.rating)}</span>
                        </div>
                        <p class="mb-0 text-muted">${new Date(r.createdAt).toLocaleDateString()}</p>
                        <p class="mt-2 text-dark">${r.comment}</p>
                    </div>
                `).join('');
            }
        } catch (e) { console.error(e); }
    }

    function setupReviewForm(id) {
        const form = document.getElementById('review-form');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            form.innerHTML = '<div class="alert alert-info">Please <a href="login.html">Login</a> to leave a review.</div>';
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;

            try {
                const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tripId: id,
                        username: user.username,
                        rating: rating,
                        comment: comment
                    })
                });
                if (res.ok) {
                    alert('Review submitted!');
                    form.reset();
                    loadReviews(id);
                }
            } catch (e) { console.error(e); }
        });
    }

    loadTripDetails();
});
