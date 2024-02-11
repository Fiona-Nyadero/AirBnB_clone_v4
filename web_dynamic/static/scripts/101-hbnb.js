document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('button').addEventListener('click', function () {
        const checkedAmenities = Array.from(document.querySelectorAll('.amenities input:checked')).map(input => input.dataset.id);
        const checkedStates = Array.from(document.querySelectorAll('.locations input:checked')).map(input => input.dataset.id);
        const checkedCities = Array.from(document.querySelectorAll('.locations ul input:checked')).map(input => input.dataset.id);

        const data = {
            amenities: checkedAmenities,
            states: checkedStates,
            cities: checkedCities
        };

        fetch('http://0.0.0.0:5001/api/v1/places_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                const placesSection = document.querySelector('.places');
                
                placesSection.innerHTML = '';

                data.forEach(place => {
                    const article = document.createElement('article');
                    article.innerHTML = `
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">${place.description || ''}</div>
                    `;
                    placesSection.appendChild(article);
                });
            })
            .catch(error => console.error('Error fetching places:', error));
    });

    document.getElementById('reviews-toggle').addEventListener('click', function () {
        const reviews = document.querySelectorAll('.review');
        const toggleText = document.getElementById('reviews-toggle').textContent;
    
        if (toggleText === 'show') {
            reviews.forEach(review => {
                review.style.display = 'block';
            });
            document.getElementById('reviews-toggle').textContent = 'hide';
        } else {
            reviews.forEach(review => {
                review.style.display = 'none';
            });
            document.getElementById('reviews-toggle').textContent = 'show';
        }
    });    
});