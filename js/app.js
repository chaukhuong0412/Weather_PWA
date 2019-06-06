var container = document.querySelector('.container');
var cardTemplate = document.querySelector('.cardTemplate');
var cards = {};
var selected = document.querySelector('#selectedCityToAdd');
var url = 'https://api.openweathermap.org/data/2.5/weather?APPID=3acf6a94d226fdbd6fffc6d6ff885385&units=metric&q=';
var selectedCities = [];

document.querySelector('#addBut').addEventListener('click', function () {
    var selectedCity = selected.options[selected.selectedIndex].textContent;
    if (!selectedCities.includes(selectedCity)) {
        selectedCities.push(selectedCity);
    }
    getForcastOfCity(selectedCity);
    saveSelectedCities();
})

saveSelectedCities = function() {
    window.localforage.setItem('selectedCities', selectedCities);
    window.localforage.getItem('selectedCities', function(cities) {
        console.log(cities);
    });
}

getForcastOfCity = function(city) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var data = JSON.parse(request.response);
                updateCard(data);
            }
        }
    }
    request.open('GET', url + city);
    request.send();
}



updateCard = function (data) {
    var card = cards[data.name];

    if (!card) {
        var card = cardTemplate.cloneNode(true);
        card.removeAttribute('hidden');
        card.querySelector('.location').textContent = data.name;
        container.appendChild(card);
        cards[data.name] = card;
    }

    card.querySelector('.current .temperature .value').textContent = Math.round(data.main.temp);
    var date = new Date(data.dt*1000);
    card.querySelector('.date').textContent = date;
}

document.addEventListener('DOMContentLoaded', function() {
    window.localforage.getItem('selectedCities', function(err, cities) {
        if (cities) {
            selectedCities = cities;
            selectedCities.forEach(city => getForcastOfCity(city));
        }
    });
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
     .register('/service-worker.js')
     .then(function() { 
        console.log('Service Worker Registered'); 
      });
  }
