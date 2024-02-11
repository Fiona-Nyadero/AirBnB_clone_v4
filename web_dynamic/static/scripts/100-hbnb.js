document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.locations input[type="checkbox"]');
    const locationsH4 = document.querySelector('.locations h4');
    const searchButton = document.querySelector('.filters button');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const checkedLocations = Array.from(checkboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => ({
                    id: checkbox.dataset.id,
                    name: checkbox.dataset.name
                }));

            locationsH4.textContent = checkedLocations.map(location => location.name).join(', ');
        });
    });

    searchButton.addEventListener('click', function () {
        const checkedAmenities = Array.from(document.querySelectorAll('.amenities input:checked')).map(input => input.dataset.id);
        const checkedCities = Array.from(document.querySelectorAll('.locations input[type="checkbox"]:checked'))
            .filter(checkbox => checkbox.dataset.id.startsWith('city'))
            .map(checkbox => checkbox.dataset.id.replace('city-', ''));
        const checkedStates = Array.from(document.querySelectorAll('.locations input[type="checkbox"]:checked'))
            .filter(checkbox => checkbox.dataset.id.startsWith('state'))
            .map(checkbox => checkbox.dataset.id.replace('state-', ''));

        fetch('http://0.0.0.0:5001/api/v1/places_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amenities: checkedAmenities,
                cities: checkedCities,
                states: checkedStates
            })
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
});