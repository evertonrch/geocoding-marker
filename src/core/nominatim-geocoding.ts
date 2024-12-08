export default interface NominatimGeocoding {
    lat: number
    lon: number
    display_name: string
    addresstype: string
    [key: string]: string | number // Outros campos opcionais
}