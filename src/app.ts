const form = document.querySelector("form") as HTMLFormElement
const addressInput = document.querySelector("#address") as HTMLInputElement

const searchAddressHandler = (e: Event) => {
    e.preventDefault()

    const enteredAddress = addressInput.value

    if(!enteredAddress) {
        alert("please, enter a address")
        return
    }

    console.log(enteredAddress) 
}

form.addEventListener("submit", searchAddressHandler)