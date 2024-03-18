import bycicles from "../../assets/data/cycle.json"
import accidents from "../../assets/data/road_accidents.json"
import {bbox, featureCollection, pointGrid, pointsWithinPolygon} from "@turf/turf";
import circle from "@turf/circle";


const fatalAccidents = (() => {
    return featureCollection(accidents.features.filter((value) => {
        return value.properties.ACCIDENT_SEVERITY == "Fatal";
    }));
});


// eslint-disable-next-line no-restricted-globals
onmessage = (message) => {
    console.log('Received message from the main thread:', message.data);
    const options = {steps: 100, units: 'meters', properties: {foo: 'bar'}};
    const bycicleRentalsWithRadius= bycicles.features.map(el => circle(el, message.data[0], options));
    const rentalsBBox = bycicleRentalsWithRadius.map(bbox);
    const collections = rentalsBBox.map(el => pointGrid(el, message.data[0] / 8, {units: "meters"}))
    const myList = []
    for (let featureCollection of collections.flat()) {
        myList.push(featureCollection.features)
    }
    let allPoints = featureCollection(myList.flat());
    if (message.data[2]){
        const accidentsWithRadius = fatalAccidents().features.map(el => circle(el, message.data[1], options))
        const pointsToRemove = pointsWithinPolygon(allPoints, featureCollection(accidentsWithRadius));
        allPoints.features = allPoints.features.filter(point => !pointsToRemove.features.includes(point));
    }
    // Send the result back to the main thread
    postMessage(allPoints);
};