import {BarGauge} from "devextreme-react";
import {Export, Font, Label, Title} from "devextreme-react/chart";


export const MyGauge = () => {
    const values = [47.27, 65.32, 84.59, 71.86];

    return (
        <BarGauge
            id="gauge"
            startValue={0}
            endValue={100}
            defaultValues={values}
        />

    );


}