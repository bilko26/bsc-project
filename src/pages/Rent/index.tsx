import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import ward from "../../assets/data/wards.json";
import { Chart, Series } from "devextreme-react/chart";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataProvider, { RentData } from "../../dataprovider/DataProvider.ts";
import { SelectBox } from "devextreme-react";
import { SelectBoxTypes } from "devextreme-react/select-box";
import styles from "./rent.module.css";

type TestEntry = {
  wardname: string;
  value: number;
};

function RentDashboard() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);

  const [year, setYear] = useState();
  const [currentWard, setCurrentWard] = useState();

  const geoJsonRef = useRef();

  useEffect(() => {
    DataProvider.getRentData().then((value) => {
      setRows(value.data);
    });
  }, []); // [] means just do this once, after initial render

  const onValueChanged = useCallback(
    (e: SelectBoxTypes.ValueChangedEvent, f) => {
      f(e.value);
    },
    []
  );

  useEffect(() => {
    setData(
      rows.filter((value: RentData) => {
        return (
          (year === undefined || value.year == year) &&
          (currentWard === undefined || value.ward == currentWard)
        );
      })
    );
  }, [year, rows, currentWard]);

  const wardNames = useMemo(() => {
    const wards = new Set<string>();
    const years = new Set<number>();

    rows.forEach((value: RentData) => {
      wards.add(value.ward);
      years.add(value.year);
    });

    return { wards, years };
  }, [rows]);

  const calculation = useMemo(() => {
    const wards = new Map<string, [number]>();
    const yearMap = new Map<number, [number]>();

    data.forEach((value: RentData) => {
      if (!yearMap.get(value.year)) {
        yearMap.set(value.year, [value.rent]);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        yearMap.get(value.year).push(value.rent);
      }

      if (!wards.get(value.ward)) {
        wards.set(value.ward, [value.rent]);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        wards.get(value.ward).push(value.rent);
      }
    });

    const yearList: [TestEntry] = [];
    yearMap.forEach((value, key) => {
      const sum = value.reduce((a, b) => a + b, 0);
      const avg = sum / value.length || 0;
      yearList.push({ wardname: String(key), value: avg });
    });
    const myList: [TestEntry] = [];
    wards.forEach((value, key) => {
      const sum = value.reduce((a, b) => a + b, 0);
      const avg = sum / value.length || 0;
      myList.push({ wardname: String(key), value: avg });
    });
    myList.sort((b, a) => b.wardname - a.wardname);

    yearList.sort((b, a) => b.wardname - a.wardname);

    return { myList, yearList };
  }, [data]);

  function getColor(d) {
    return d > 1000
      ? "#800026"
      : d > 700
      ? "#FD8D3C"
      : d > 600
      ? "#FEB24C"
      : d > 500
      ? "#FED976"
      : "#FFEDA0";
  }

  const getPriceForWard = useCallback(
    (ward: string) => {
      return calculation.myList.find((value) => value.wardname == ward)?.value;
    },
    [calculation.myList]
  );

  const getStyleForWard = useCallback(
    (feature) => {
      const wardName = feature.properties.WARD;
      return {
        fillColor: getColor(getPriceForWard(wardName)),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },
    [getPriceForWard]
  );

  return (
    <div className={styles.rentContainer}>
      <div className={styles.filter}>
        <h2 style={{ textAlign: "center" }}>Filters</h2>
        <div className={styles.filterBox}>
          <div className={styles.title}>Ward:</div>
          <SelectBox
            className={styles.selectBox}
            items={[...wardNames.wards].sort((a, b) => a - b)}
            onValueChanged={(e) => onValueChanged(e, setCurrentWard)}
          />
        </div>
        <div className={styles.filterBox}>
          <div className={styles.title}>Years:</div>
          <SelectBox
            className={styles.selectBox}
            items={[...wardNames.years].sort((a, b) => b - a)}
            onValueChanged={(e) => onValueChanged(e, setYear)}
          />
        </div>
      </div>
      <div className={styles.charts}>
        <Chart className={styles.chart} dataSource={calculation.yearList}>
          <Series
            valueField="value"
            argumentField="wardname"
            name="Rent Data"
            type="bar"
            color="#ffaa66"
          ></Series>
        </Chart>
        <div className={styles.divider}></div>
        <Chart
          className={styles.chart}
          dataSource={calculation.myList}
          rotated={true}
        >
          <Series
            valueField="value"
            argumentField="wardname"
            name="Rent Data"
            type="bar"
            color="#ffaa66"
          />
        </Chart>
      </div>
      <div className={styles.mapDiv}>
        <div className={styles.myContainer}>
          <MapContainer center={[55.860916, -4.251433]} zoom={11.75}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={ward}
              style={getStyleForWard}
              ref={geoJsonRef}
            ></GeoJSON>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default RentDashboard;
