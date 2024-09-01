const weather = {
  apiKey: "253047a8fb71256ad2e69d4b85300d50",
  
  fetchWeather: function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data))
      .catch((error) => this.showError(error));
  },
  
  displayWeather: function(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity, feels_like, pressure } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/hr";
    document.querySelector(".feels-like").innerText = "Feels like: " + feels_like + "°C";
    document.querySelector(".pressure").innerText = "Pressure: " + pressure + " hPa";
    document.querySelector(".sunrise").innerText = "Sunrise: " + new Date(sunrise * 1000).toLocaleTimeString();
    document.querySelector(".sunset").innerText = "Sunset: " + new Date(sunset * 1000).toLocaleTimeString();
    document.querySelector(".error").classList.add("hidden");

    this.setBackgroundImage(name);
  },

  setBackgroundImage: function(city) {
    const unsplashApiKey = 'NMJYnSNiekY2WnQuk1B-OlOP4EDsBWj53rg5axg4opg';
    const unsplashApiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${unsplashApiKey}`;

    fetch(unsplashApiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;
          document.body.style.backgroundImage = `url(${imageUrl})`;
        } else {
          console.error('No images found for the location.');
          document.body.style.backgroundImage = '';
        }
      })
      .catch(error => {
        console.error('Error fetching background image:', error);
      });
  },

  showError: function(error) {
    document.querySelector(".error").classList.remove("hidden");
  },

  search: function() {
    const city = document.querySelector(".search-bar").value;
    if (city) {
      this.fetchWeather(city);
    }
  },

  fetchDefaultWeather: function() {
    const city = localStorage.getItem("lastCity") || "Jodhpur";
    this.fetchWeather(city);
  },

  init: function() {
    document.querySelector(".search button").addEventListener("click", () => {
      const city = document.querySelector(".search-bar").value;
      this.search();
      localStorage.setItem("lastCity", city);
    });

    document.querySelector(".search-bar").addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const city = event.target.value;
        this.search();
        localStorage.setItem("lastCity", city);
      }
    });

    this.fetchDefaultWeather();
  }
};

weather.init();
