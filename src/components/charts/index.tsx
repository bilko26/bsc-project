import {Chart, Series} from "devextreme-react/chart";

export const MyChart = () => {
    const dataSource = [{
        district: 'Some Glasgow District',
        oranges: 3,
    }, {
        district: 'Something else',
        oranges: 2,
    }, {
        district: 'Yet another',
        oranges: 3,
    }, {
        district: 'Another',
        oranges: 6,
    }];
    return (
        <Chart id="chart" dataSource={dataSource}>
            <Series
                valueField="oranges"
                argumentField="district"
                name="Some Random Data"
                type="bar"
                color="#ffaa66" />
        </Chart>

    );
}