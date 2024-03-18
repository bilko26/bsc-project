import {MapContainer, TileLayer} from "react-leaflet";
import {HeatmapLayerFactory} from "@vgrid/react-leaflet-heatmap-layer";
import "leaflet/dist/leaflet.css";
import styles from "./heat.module.css";
import {useCallback, useEffect, useState} from "react";
import {CheckBox, Slider} from "devextreme-react";
import {Tooltip} from "devextreme-react/slider";


function HeatMap() {

    const [result, setResult] = useState(null);
    const [worker, setWorker] = useState(null);

    const [bikeProximity, setBikeProximity] = useState(500);
    const [accidentDistance, setAccidentDistance] = useState(500);
    const [includeAccidents, setIncludeAccidents] = useState(false);


    useEffect(() => {
        // Create a new web worker
        const myWorker = new Worker(
            new URL('./worker', import.meta.url), {type: "module"}
        );
        // Set up event listener for messages from the worker
        myWorker.onmessage = function (event) {
            console.log('Received result from worker:', event.data);
            setResult(event.data);
        };
        myWorker.onerror = e => {
            console.log(e);
        }
        // Save the worker instance to state
        setWorker(myWorker);

        myWorker.postMessage([bikeProximity, accidentDistance])
        // Clean up the worker when the component unmounts
        return () => {
            myWorker.terminate();
        };
    }, []); // Run this effect only once when the component mounts


    const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>()


    const onBikeProximityValueChanged = (e: { value?: number; }) => {
        setBikeProximity(e.value)
        worker.postMessage([e.value, accidentDistance, includeAccidents])
    };

    const onAccidentDistanceValueChanged = (e: { value?: number; }) => {
        setAccidentDistance(e.value)
        console.log("Include accidents: " + includeAccidents)
        worker.postMessage([bikeProximity, e.value, includeAccidents])
    };

    const handleChange = (e) => {
        setIncludeAccidents(e.value)
        worker.postMessage([bikeProximity, accidentDistance, e.value])
    }


    return (
        <div className={styles.heatContainer}>
            <div>
                I want to avoid living near lethal accidents
                <br/>
                <CheckBox value={false} onValueChanged={handleChange}/>
                <br/>
                <br/>
                Change distance from lethal road accidents
                <Slider min={100} max={1500} step={100} value={500}
                        onValueChanged={onAccidentDistanceValueChanged}
                        valueChangeMode={"onHandleRelease"}>
                    <Tooltip enabled={true}/>
                </Slider>
                {accidentDistance}
            </div>
            <div>
                Increase distance from automatic bike rental locations
                <Slider min={100} max={2500} step={100} value={500}
                        onValueChanged={onBikeProximityValueChanged}
                        valueChangeMode={"onHandleRelease"}>
                    <Tooltip enabled={true}/>
                </Slider>
                {bikeProximity}
            </div>
            <div className={styles.mapDiv}>
                <div className={styles.myContainer}>
                    <MapContainer center={[55.860916, -4.251433]} zoom={10}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {result ?
                            <HeatmapLayer
                                points={result.features}
                                longitudeExtractor={(m) => m.geometry.coordinates[0]}
                                latitudeExtractor={(m) => m.geometry.coordinates[1]}
                                intensityExtractor={(m => 30)}
                                max={100}
                                minOpacity={10}
                                radius={10}
                            /> : <div></div>
                        }
                    </MapContainer>
                </div>
            </div>

        </div>
    );
}

export default HeatMap;
