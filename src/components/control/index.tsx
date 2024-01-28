// import {createControlComponent} from "@react-leaflet/core";
import {Control, DomUtil} from "leaflet";
import Navbar from "../nav";
import {createControlComponent} from "@react-leaflet/core";


export const MyControl = () => {

    const control = Control.extend({
        onAdd: function (map) {
            this._div = DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        },

        update: function (props) {
            console.log("in the update")
            this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
                '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
                : 'Hover over a state');
        }
    });

    return (
        control
    )
}

export default MyControl;
