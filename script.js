function RandomIntInclusive(min, max) {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
}
  
function BuildingList(list) {
  console.log('fired cut list');
  const newList = [];
  for (let i = 0; i < 15; i++) {
    const index = Math.floor(Math.random() * list.length);
    newList.push(list[index]);
  }
  return newList;
}

function injectHTML(list){
  console.log('fired injectHTML');
  const target = document.querySelector('#building_list');
  target.innerHTML = list.map(item => `<li>${item.name}</li>`).join('');
}
  
  function filterList(list, query) {
    const filteredList = [];
  
    for (let i = 0; i < list.length; i++) {
      const lowerCaseName = list[i].name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
  
      if (lowerCaseName.includes(lowerCaseQuery)) {
        filteredList.push(list[i]);
      }
    }
  
    return filteredList;
  }
  function initMap(){
    const carto = L.map('map').setView([38.90, -76.85], 14.2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carto);
    return carto;
  }

  function markerPlace(array, map) {
    console.log('array for markers', array);
  
    // Clear existing markers from the map
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  
    // Add new markers to the map
    array.forEach((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.long);
      const popupContent = JSON.stringify(item.name);
      const marker = L.marker([lat, lng]).bindPopup(popupContent);
      marker.addTo(map);
    });
  }
  
  async function mainEvent() { 
    const mainForm = document.querySelector('.main_form');
    
    const textField = document.querySelector('#build');
    const filterDataButton = document.querySelector('#filter')
    
  
    const carto = initMap();

    const storedData = localStorage.getItem('storedData');
    let parsedData = JSON.parse(storedData);

    let currentList = []; 
    let values = [];
    
    /// fetch API
    const results = await fetch('https://api.umd.io/v1/map/buildings');

    const storedList = await results.json();
    localStorage.setItem('storedData', JSON.stringify(storedList));
    parsedData = storedList;
  
    currentList = BuildingList(storedList)

    filterDataButton.addEventListener('click', (event) => {
      console.log('clicked FilterButton');
      
      const buttons = document.querySelectorAll('input[name="type"]');
      buttons.forEach((radio) => {
        if (radio.checked) {
        values.push(radio.value)}
      });

      const formData = new FormData(mainForm);
      const formProps = Object.fromEntries(formData);

      if (values.length > 0){
        console.log(values)
        const newList = filterList(currentList, formProps.type);
        console.log(newList);
        injectHTML(newList);
        markerPlace(newList, carto);
        values.length = 0;
        console.log(values);
        buttons.checked = false;
      }
      else{
        currentList = BuildingList(storedList)
        injectHTML(currentList);
        markerPlace(currentList, carto);
      }
    })

    textField.addEventListener('input', async (event) => {
      values.length = 0;
      console.log('input', event.target.value);
      const searchTerm = event.target.value.toLowerCase();
      const newList = storedList.filter(item => {
        const itemName = item.name.toLowerCase();
        return itemName.includes(searchTerm);
      });
      console.log(newList);
      await Promise.all([injectHTML(newList), markerPlace(newList, carto)]);
    })
  
  }
  document.addEventListener('DOMContentLoaded', async () => mainEvent());
