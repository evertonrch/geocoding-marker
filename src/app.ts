import axios from "axios"
import * as L from "leaflet"

const form = document.querySelector("form") as HTMLFormElement
const addressInput = document.querySelector("#address") as HTMLInputElement
const mapElement = document.querySelector("#map") as HTMLDivElement

const map = L.map(mapElement)

enum AddressType {
    CITY = "city",
    STATE = "state"
}

interface NominatimGeocoding {
    lat: number
    lon: number
    display_name: string
    addresstype: string
    [key: string]: string | number // Outros campos opcionais
}

const renderMap = (place: NominatimGeocoding, zoom: number = 7): void => {
    map.setView([place.lat, place.lon], zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    const marker = L.marker([place.lat, place.lon]).addTo(map);
    marker.bindPopup(place.display_name).openPopup();
}

const getData = async (url: string): Promise<NominatimGeocoding[]> => {
    const response = await axios.get<NominatimGeocoding[]>(url)

    if(response.status !== 200 || response.data.length == 0) {
        throw new Error(`data not fount ${response.data}`)
    }
    
    console.log(response)
    return response.data
}

const searchAddressHandler = async (e: Event) => {
    e.preventDefault()

    const enteredAddress = addressInput.value

    if (!enteredAddress) {
        alert("please, enter a address")
        return
    }

    try {
        const data = await getData(`https://nominatim.openstreetmap.org/search?q=${encodeURI(enteredAddress)}&format=json`) 
        
        data.forEach(element => {
            // renderiza localidades por tipo de território
            if(element.addresstype === AddressType.CITY || element.addresstype === AddressType.STATE) {
                renderMap(element)
            }
        })
    } catch(err) {
        alert(err)    
    }

    addressInput.value = ""
}
    
form.addEventListener("submit", searchAddressHandler)