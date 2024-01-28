import "./index.css"
import "leaflet/dist/leaflet.css";
import {GeoJSON, LayerGroup, LayersControl, MapContainer, Marker, TileLayer} from "react-leaflet";
import ward from "../../assets/data/wards.json";
import dp from "../../assets/data/heatmap/developmentPlan.json";
import tree from "../../assets/data/heatmap/Tree_Preservation_Orders_(TPOs).json";
import accidents from "../../assets/data/road_accidents.json";
import cycle from "../../assets/data/cycle.json";

import cctv from "../../assets/data/heatmap/CCTV.json";
import {bbox, FeatureCollection, GeoJSONObject, pointGrid} from "@turf/turf";
import L from "leaflet";
import {useMemo} from "react";
import {PieChart} from "devextreme-react";
import {Connector, Export, Label, Series, Size} from "devextreme-react/pie-chart";
import {Chart, Series as ChartSeries } from "devextreme-react/chart";


function UrbanInfoDashboard() {


    console.log(cycle)
    const cctvCount = cctv.features.length
    const listOfAccidents: unknown = []

    function getIcon(url: string, width: number, height: number) {
        return new L.Icon({
            iconUrl: url,
            iconRetinaUrl: '/cctv.png',
            iconSize: new L.Point(width, height),
        });
    }

    const accidentIcon = getIcon('/accident.png', 30, 30);
    const cctvIcon = getIcon('/cctv.png', 30, 30);
    const bycicle = getIcon('/bycicle.png', 40, 40);


const myRandomFunc = (feature, layer) => {
    layer.on('click', function (e) {
        // e = event
        //console.log(layer);
        // You can make your ajax call declaration here
        //$.ajax(...
    });
}

const changeMarker = (feature, latlng, icon) => {
    return L.marker(latlng, {icon: icon})
}

const geo: FeatureCollection = accidents

geo.features.forEach(value => {
    listOfAccidents.push(value.properties);
})
const filter = geo.features.filter(value => {
    return value.properties.ACCIDENT_SEVERITY == "Fatal"
});


const values = useMemo(() => {
    const counts = {};

    const aggreagationFields = ["DAY_OF_WEEK", "ROAD_SURFACE_CONDITIONS", "ACCIDENT_SEVERITY"]
    const helper = {}

    for (const record of listOfAccidents) {
        for (const field of aggreagationFields) {
            counts[record[field]] = counts[record[field]] ? counts[record[field]] + 1 : 1;
            helper[field] = helper[field] ? helper[field].add(record[field]) : new Set<string>([record[field]])
        }

    }

    const returnArray = []
    for (const field of aggreagationFields) {
        const someArray = []
        const set: Set<string> = helper[field]
        set.forEach((value) => {
            someArray.push({label: value, value: counts[value]})
        })
        returnArray.push(someArray)
    }

    return returnArray;

}, [listOfAccidents])

console.log(cctv)
console.log(values)


return (
    <div className={"parent"}>
        <div className={"mapDiv"}>
            <div className={"myContainer"}>
                <MapContainer center={[55.860916, -4.251433]} zoom={11.75}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LayersControl>
                        <LayerGroup>
                            <LayersControl.Overlay name={"CCTV"}>
                                <GeoJSON data={cctv} onEachFeature={myRandomFunc}
                                         pointToLayer={(f, l) => changeMarker(f, l, cctvIcon)}/>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name={"Wards"}>
                                <GeoJSON data={ward} onEachFeature={myRandomFunc}/>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name={"Road Accidents"}>
                                <GeoJSON data={filter} onEachFeature={myRandomFunc}
                                         pointToLayer={(f, l) => changeMarker(f, l, accidentIcon)}/>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name={"Bycicle rent"}>
                                <GeoJSON data={cycle} onEachFeature={myRandomFunc} pointToLayer={(f, l) => changeMarker(f, l, bycicle)}/>
                            </LayersControl.Overlay>
                            <LayersControl.Overlay name={"Green Belt"}>
                                <GeoJSON data={dp} onEachFeature={myRandomFunc} pointToLayer={(f, l) => changeMarker(f, l, bycicle)}/>
                            </LayersControl.Overlay>
                        </LayerGroup>


                    </LayersControl>
                    {/*<GeoJSON data={dp} onEachFeature={myRandomFunc}/>*/}
                    {/*<GeoJSON data={tree} onEachFeature={myRandomFunc}/>*/}

                    {/*<GeoJSON data={featureCollection} onEachFeature={myRandomFunc}/>*/}
                </MapContainer>
            </div>
        </div>

        <div className={"div3"}>
            <div>
                There are {cctvCount} live
                CCTVs around Glasgow
            </div>
        </div>
        Some filters to modify the chart below
        <div className={"div2"}>
            <Chart id="chart" dataSource={values[0]}>
                <ChartSeries
                    valueField="value"
                    argumentField="label"
                    name="Accidents by days of the week"
                    type="bar"
                    color="#ffaa66"/>
            </Chart>

            <PieChart
                id="pie"
                dataSource={values[0]}
                palette="Material"
                title="Accidents by days of the week"
                resolveLabelOverlapping={"shift"}
                // onPointClick={pointClickHandler}
                // onLegendClick={legendClickHandler}
            >
                <Series argumentField="label" valueField="value">
                    <Label visible={true}>
                        <Connector visible={true} width={1}/>
                    </Label>
                </Series>

                <Size width={500}/>
                <Export enabled={true}/>
            </PieChart>

            <PieChart
                id="pie"
                dataSource={values[1]}
                palette="Material"
                title="Accidents by road conditions"
                resolveLabelOverlapping={"shift"}
                // onPointClick={pointClickHandler}
                // onLegendClick={legendClickHandler}
            >
                <Series argumentField="label" valueField="value">
                    <Label visible={true}>
                        <Connector visible={true} width={1}/>
                    </Label>
                </Series>

                <Size width={500}/>
                <Export enabled={true}/>
            </PieChart>

            <PieChart
                id="pie"
                dataSource={values[2]}
                palette="Material"
                title="Severity"
                resolveLabelOverlapping={"shift"}
                // onPointClick={pointClickHandler}
                // onLegendClick={legendClickHandler}
            >
                <Series argumentField="label" valueField="value">
                    <Label visible={true}>
                        <Connector visible={true} width={1}/>
                    </Label>
                </Series>

                <Size width={500}/>
                <Export enabled={true}/>
            </PieChart>
        </div>
    </div>
);
}

export default UrbanInfoDashboard;