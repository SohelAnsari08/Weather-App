const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
// const userContainer = document.querySelector("[weather-container]");

const grantAccesContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorHandeler = document.querySelector(".error-container");


//initially variables nedd???

let currentTab = userTab;
const API_KEY = "f58d952cff7c5c8e8f10230c05334838";
currentTab.classList.add("current-tab");
getfromSessionStorage();


//to switch from one tab to another tab by clicking it
function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form wala conatainer is invisible if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccesContainer.classList.remove("active");
            errorHandeler.classList.remove("active");
            searchForm.classList.add("active");
        } 
        else{
            //main pehle search wale tab pr tha , ab your weather tab visisble karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorHandeler.classList.remove("active");

            //ab main your weather tab me aagaya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinate, if we haved save them there 
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
})


//check if coordinate are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coodinates");
    if(!localCoordinates) {
        //agar local coorinates nahi mile
        grantAccesContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation Support Available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }


    sessionStorage.setItem("user-coodinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAcessButton = document.querySelector("[data-grantAccess]");

grantAcessButton.addEventListener("click", getLocation);


async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccesContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    // API CAll
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(error) {
        //hw
    }
}

function renderWeatherInfo(weatherInfo) {
    //firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[datacountryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it in UI elementss
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp + " " +"°C" ;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}




// Search Form
let searchInput = document.querySelector('[data-searchInput]')
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(searchInput.value === ""){
        return;
    }
    const cityName = searchInput.value;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccesContainer.classList.remove("active");
    errorHandeler.classList.remove("active");

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        if(data?.cod === '404'){
            errorHandeling();
        }

        renderWeatherInfo(data);

    }
    catch(error){
        console.log("Error Occured")
    }
}


function errorHandeling(){
    console.log("Error hai bhai")
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccesContainer.classList.remove("active");
    errorHandeler.classList.add("active");
}