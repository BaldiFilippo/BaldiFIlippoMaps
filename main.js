import './style.css'
const myMap = L.map('map').setView([0, 0], 0)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 2,

  //position
  noWrap: true,

  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(myMap)

var myIcon = L.icon({
  iconUrl: 'marker.png',
  iconSize: [30, 40],
})

const table = document.querySelector('table')

fetch('/data.json')
  .then((response) => response.json())
  .then((data) => {
    //create markers
    data.forEach((element) => {
      L.marker([element.latitude, element.longitude], { icon: myIcon }).addTo(
        myMap
      )

      //update the table with the data
      const row = document.createElement('tr')
      row.innerHTML = `<td>${element.Name}</td><td>${element.Country}</td><td><label for="my-modal" class="btn modal-btn">info</label></td>`
      table.appendChild(row)

      const modalsBtn = document.querySelectorAll('.modal-btn')
      const modal = document.querySelector('.modal')

      modalsBtn.forEach((btn) => {
        btn.addEventListener('click', () => {
          //get the relative element
          const currentRow = btn.parentElement.parentElement
          const index = Array.from(currentRow.parentElement.children).indexOf(
            currentRow
          )
          const currentElement = data[index - 2]

          const modal = document.querySelector('.modal')
          modal.innerHTML = `<div class="modal-box">
      <h3 class="modal-title font-bold text-lg">${currentElement.Name}</h3>
      <p class="py-4">
          ${currentElement.Country}
      </p>
      <div class="modal-action">
        <label for="my-modal" class="btn">Close</label>
      </div>
    </div>
    `
        })
      })
    })
  })
