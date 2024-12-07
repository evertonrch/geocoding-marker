import axios from "axios"

const form = document.querySelector("form") as HTMLFormElement
const addressInput = document.querySelector("#address") as HTMLInputElement

interface NominatimGeocoding {
    lat: string;
    lon: string;
    display_name: string;
    [key: string]: string | number; // Outros campos opcionais
}

const searchAddressHandler = (e: Event) => {
    e.preventDefault()

    const enteredAddress = addressInput.value

    if (!enteredAddress) {
        alert("please, enter a address")
        return
    }

    axios
        .get<NominatimGeocoding[]>(`https://nominatim.openstreetmap.org/search?q=${encodeURI(enteredAddress)}&format=json`)
        .then(response => {
            response.data.forEach(place => {
                console.log(place.type)
            })
        })
        .catch(err => console.error(err))
}

form.addEventListener("submit", searchAddressHandler)