/**
 * DataStore - Simulates a database using LocalStorage
 * This allows the app to work without a running Node.js server.
 */

const DataStore = {
    defaults: [
        { id: 1, title: 'Rural Village Tour - Sylhet', category: 'package', price: 25000, image: 'images/img_1.jpg', description: 'Experience the authentic rural life in Sylhet. Visit tea gardens, traditional houses, and enjoy local cuisine.' },
        { id: 2, title: 'Traditional Sports - Kabaddi', category: 'package', price: 42000, image: 'images/img_2.jpg', description: 'Watch and participate in the exciting traditional sport of Kabaddi. A festival of strength and strategy.' },
        { id: 3, title: 'Countryside Homestay', category: 'hotel', price: 20000, image: 'images/img_3.jpg', description: 'Stay with a local family in Chittagong. Learn their customs, cooking, and daily way of life.' },
        { id: 4, title: 'Cricket Championship', category: 'package', price: 35000, image: 'images/img_4.jpg', description: 'Experience the passion of cricket in Dhaka. includes stadium tickets and meet-and-greet.' },
        { id: 5, title: 'Agro-Tourism Barisal', category: 'package', price: 28000, image: 'images/img_5.jpg', description: 'Visit the rice bowl of Bangladesh. Participate in harvest and boat rides.' },
        { id: 6, title: 'Cultural Heritage Rajshahi', category: 'package', price: 32000, image: 'images/img_6.jpg', description: 'Explore ancient temples and silk factories in Rajshahi.' }
    ],

    init() {
        if (!localStorage.getItem('trips')) {
            localStorage.setItem('trips', JSON.stringify(this.defaults));
        }
    },

    getTrips(filter = {}) {
        this.init();
        let trips = JSON.parse(localStorage.getItem('trips'));
        if (filter.category) {
            trips = trips.filter(t => t.category.toLowerCase() === filter.category.toLowerCase());
        }
        return trips;
    },

    getTripById(id) {
        this.init();
        const trips = JSON.parse(localStorage.getItem('trips'));
        return trips.find(t => t.id == id);
    },

    addTrip(trip) {
        this.init();
        const trips = JSON.parse(localStorage.getItem('trips'));
        trip.id = trips.length ? Math.max(...trips.map(t => t.id)) + 1 : 1;
        trips.push(trip);
        localStorage.setItem('trips', JSON.stringify(trips));
        return trip;
    }
};
