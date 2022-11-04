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

const title = document.querySelector('.title')

title.addEventListener('click', () => {
  myMap.setView([0, 0], 0)
})

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
      row.classList.add('listRow')
      row.innerHTML = `<td><a class="elementName">${element.Name}</a></td><td>${element.Country}</td><td></td>`
      table.appendChild(row)

      // const modalsBtn = document.querySelectorAll('.modal-btn')

      // modalsBtn.forEach((btn) => {
      //   btn.addEventListener('click', () => {
      //     //get the relative element
      //     const currentRow = btn.parentElement.parentElement
      //     const index = Array.from(currentRow.parentElement.children).indexOf(
      //       currentRow
      //     )
      //     const currentElement = data[index - 2]

      //     const modal = document.querySelector('.modal')
      //     modal.innerHTML = `<div class="modal-box">
      //       <h3 class="modal-title font-bold text-lg">${currentElement.Name}</h3>
      //       <p class="py-4">
      //         ${currentElement.Address}
      //       </p>
      //       <div class="modal-action">
      //         <label for="my-modal" class="btn">Close</label>
      //       </div>
      //     </div>
      //     `
      //   })
      const names = document.querySelectorAll('.elementName')

      //fly to places on click
      names.forEach((name) => {
        name.addEventListener('click', () => {
          const currentRow = name.parentElement.parentElement
          const index = Array.from(currentRow.parentElement.children).indexOf(
            currentRow
          )
          const currentElement = data[index - 2]
          myMap.flyTo(
            [currentElement.latitude, currentElement.longitude],
            10,
            {
              duration: 2,
            },
            setTimeout(() => {
              //add popup
              L.popup({ closeButton: false, offset: L.point(0, -8) })
                .setLatLng([currentElement.latitude, currentElement.longitude])
                .setContent(
                  `<h3 class="font-bold text-lg">${currentElement.Name}</h3>
                    <p class="py-4">
                      ${currentElement.Address}
                    </p>`
                )

                .openOn(myMap)
            }, 1000)
          )
        })
      })
    })

    //searc input
    const searchInput = document.querySelector('#search')
    searchInput.addEventListener('keyup', (e) => {
      const searchValue = e.target.value.toLowerCase()
      const rows = document.querySelectorAll('.listRow')
      rows.forEach((row) => {
        if (row.innerText.toLowerCase().indexOf(searchValue) > -1) {
          row.style.display = ''
        } else {
          row.style.display = 'none'
        }
      })

      //find the element tha the user is searching for
      const searching = data.find((element) => {
        return element.Name.toLowerCase().indexOf(searchValue) > -1
      })

      console.log(searching)

      //when i press enter fly to the first element
      if (e.keyCode === 13) {
        myMap.flyTo(
          [searching.latitude, searching.longitude],
          10,
          {
            duration: 2,
          },
          setTimeout(() => {
            //add popup
            L.popup({ closeButton: false, offset: L.point(0, -8) })
              .setLatLng([searching.latitude, searching.longitude])
              .setContent(
                `<h3 class="font-bold text-lg">${searching.Name}</h3>
                    <p class="py-4">
                      ${searching.Address}
                    </p>`
              )

              .openOn(myMap)
          }, 1000)
        )
      }
    })
  })
