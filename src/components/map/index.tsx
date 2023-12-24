import {MapContainer, TileLayer, GeoJSON} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./index.css";
import lez from "../../assets/LEZ.json"


function MyMap() {

    /* const arrayFormatter = (array: any) => {
         const switchCoordinates = (coords) => {
             return coords.map((point) => [point[1], point[0]]);
         };

         const formattedArray = array.map((entry) => {
             const switchedEntry = switchCoordinates(entry[0]);
             return [switchedEntry];
         });

         return formattedArray;
     };
     */


    return (
        <div className="container">
            <MapContainer center={[55.860916, -4.251433]} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON
                    data = {lez}
                />

            </MapContainer>
        </div>
    );
}

export default MyMap;
