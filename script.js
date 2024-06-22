'use strict';

const searchBar = document.querySelector('#search-bar');
const btnSearch = document.querySelector('.btn-search');
const countriesContainer = document.querySelector('.countries');

// Function to render country data
const renderCountry = function (data, className = '') {
    const titleHtml = className === 'neighbour' ? '<div class="country__title">Neighbour country</div>' : '';
    const html = `
        <article class="country ${className}">
            ${titleHtml}
            <img class="country__img" src="${data.flags.svg}" />
            <div class="country__data">
                <h3 class="country__name">${data.name.common}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(1)}M people</p>
                <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
                <p class="country__row"><span>💰</span>${Object.values(data.currencies)[0].name}</p>
            </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
};

// Function to fetch country data
const getCountryData = function (country) {
    fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then(response => response.json())
        .then(data => {
            countriesContainer.innerHTML = ''; // Clear previous results
            renderCountry(data[0]);

            const neighbor = data[0].borders?.[0];
            if (!neighbor) return;

            // Fetch neighbor country data
            return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
        })
        .then(response => response.json())
        .then(data => renderCountry(data[0], 'neighbour'))
        .catch(err => console.error(`${err} 💥💥💥`));
};

// Event listener for search button
btnSearch.addEventListener('click', function () {
    const country = searchBar.value;
    if (country) {
        getCountryData(country);
    }
});

// Optional: trigger search on pressing Enter key
searchBar.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const country = searchBar.value;
        if (country) {
            getCountryData(country);
        }
    }
});

getCountryData('usa');
