import axios from "axios"
import * as L from "leaflet"
import NominatimGeocoding from "./core/nominatim-geocoding.js"
import StatusMessage from "./core/status-message.js"

const form = document.querySelector("form") as HTMLFormElement
const addressInput = document.querySelector("#address") as HTMLInputElement
const mapElement = document.querySelector("#map") as HTMLDivElement

const map = L.map(mapElement)

const enum AddressType {
    CITY = "city",
    STATE = "state"
}

// verifica se o serviço está disponível
const getStatusService = async (): Promise<boolean> => {
    const response = (await axios.get<StatusMessage>("https://nominatim.openstreetmap.org/status?format=json"))
    const data = response && response.data
    if (data.message === "OK") {
        return true
    }
    return false
}

const addMarker = (latitude: number, longitude: number, description: string): void => {
    const expression: L.LatLngExpression = [latitude, longitude]
    L.marker(expression).addTo(map)
        .bindPopup(description)
        .openPopup()
}

const renderMap = (place: NominatimGeocoding, zoom: number = 7): void => {
    map.setView([place.lat, place.lon], zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    addMarker(place.lat, place.lon, place.display_name)
}

const getData = async (url: string): Promise<NominatimGeocoding[]> => {
    const response = await axios.get<NominatimGeocoding[]>(url)

    if (response.status !== 200 || response.data.length == 0) {
        throw new Error(`data not fount ${response.data}`)
    }
    
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
        const isActive = await getStatusService()
        if (!isActive) {
            throw new Error("service unavailable")
        }

        const data = await getData(`https://nominatim.openstreetmap.org/search?q=${encodeURI(enteredAddress)}&format=json`)
        data.forEach(element => {
            const addressType = element.addresstype
            // renderiza localidades por tipo de território
            if (addressType === AddressType.CITY || addressType === AddressType.STATE) {
                renderMap(element)
            }
        })
    } catch (err) {
        alert(err)
    }

    addressInput.value = ""
}

form.addEventListener("submit", searchAddressHandler)