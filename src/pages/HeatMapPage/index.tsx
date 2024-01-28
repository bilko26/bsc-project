import {MapContainer, TileLayer} from "react-leaflet";
import {HeatmapLayerFactory} from "@vgrid/react-leaflet-heatmap-layer";
import roadAccidents from "../../assets/data/road_accidents.json"


import "leaflet/dist/leaflet.css";
import "./index.css"

function HeatMap() {

    const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()



    //Polygont ponttá alakítani
    // const geoJson: GeoJSONObject = ward;
    // const geoJson: GeoJSONObject = ward;
    //
    // const someFeature = geoJson.features[10];
    // // console.log(geoJson.bbox)
    // const outer = bbox(someFeature)
    // const featureCollection = pointGrid(outer, 200, {units: "meters"});
    // // console.log(featureCollection)


    return (
        <div className="container">
            <MapContainer center={[55.860916, -4.251433]} zoom={13}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/*<GeoJSON data={citylet}/>*/}

                <HeatmapLayer
                    points={roadAccidents.features}
                    longitudeExtractor={(m) => m.geometry.coordinates[0]}
                    latitudeExtractor={(m) => m.geometry.coordinates[1]}
                    intensityExtractor={(m => Math.random()*1000)}
                    max={1000}
                    minOpacity={1}
                    radius = {10}
                />

            </MapContainer>
        </div>);
}

export default HeatMap;