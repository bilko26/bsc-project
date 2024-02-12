import {Circle, FeatureGroup, GeoJSON, MapContainer, Polygon, TileLayer} from "react-leaflet";
import {HeatmapLayerFactory} from "@vgrid/react-leaflet-heatmap-layer";
import bycicle from "../../assets/data/cycle.json"
import circle from "@turf/circle"
import "leaflet/dist/leaflet.css";
import styles from "./heat.module.css";
import {Slider} from "devextreme-react";
import {useCallback, useState} from "react";
import {bbox, bboxPolygon, pointGrid} from "@turf/turf";

function HeatMap() {

    const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()

    const [sliderValue, setSliderValue] = useState(10);

    const onValueChanged = useCallback((e: { value?: any; }) => {
        setSliderValue(e.value);
    }, [setSliderValue]);


    //Polygont ponttá alakítani
    // const geoJson: GeoJSONObject = ward;
    // const geoJson: GeoJSONObject = ward;
    //
    // const someFeature = geoJson.features[10];
    // // console.log(geoJson.bbox)

    // // console.log(featureCollection)



    const options = {steps: 100, units: 'meters', properties: {foo: 'bar'}};

    const feature = circle(bycicle.features[0], 50, options);

    const features = bycicle.features.map(el => circle(el, 30, options))
    console.log(features)
    const outer = bbox(feature)
    const featureCollection = pointGrid(outer, 50, {units: "meters"});
    console.log(featureCollection)


    const outers = features.map(bbox);
    const polygons = outers.map(bboxPolygon);
    console.log(polygons)

    const collections = outers.map(el => pointGrid(el, 50, {units: "meters"}))
    // console.log(collections)
    const multipleHeats = 0
    // console.log(bycicle)

    //      <div className="myDiv">
    //                 <Slider min={0} max={100} onValueChanged={onValueChanged}/>
    //                 {/*<NumberBox min={0}*/}
    //                 {/*           step={10}*/}
    //                 {/*           max={100}*/}
    //                 {/*           value={sliderValue}*/}
    //                 {/*           onValueChanged={onValueChanged}/>*/}
    //             </div>

    return (
        <div className={styles.heatContainer}>
            <div className={styles.mapDiv}>
                <div className={styles.myContainer}>
                    <MapContainer center={[55.860916, -4.251433]} zoom={13}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <GeoJSON data={features}>

                        </GeoJSON>

                        <HeatmapLayer
                            points={collections[10].features}
                            longitudeExtractor={(m) => m.geometry.coordinates[0]}
                            latitudeExtractor={(m) => m.geometry.coordinates[1]}
                            intensityExtractor={(m => Math.random() * 1000)}
                            max={1000}
                            minOpacity={1}
                            radius={25}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default HeatMap;
