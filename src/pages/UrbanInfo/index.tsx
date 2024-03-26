import "leaflet/dist/leaflet.css";
import {
  GeoJSON,
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import ward from "../../assets/data/wards.json";
import dp from "../../assets/data/heatmap/developmentPlan.json";
import accidents from "../../assets/data/road_accidents.json";
import cycle from "../../assets/data/cycle.json";

import cctv from "../../assets/data/heatmap/CCTV.json";
import { FeatureCollection } from "@turf/turf";
import L from "leaflet";
import { useMemo, useState } from "react";
import { PieChart, Tabs } from "devextreme-react";
import { Connector, Export, Label, Series } from "devextreme-react/pie-chart";
import {
  Chart,
  Series as ChartSeries,
  Legend,
  Tooltip,
} from "devextreme-react/chart";
import styles from "./urbanInfo.module.css";

function UrbanInfoDashboard() {
  const cctvCount = cctv.features.length;
  console.log(accidents);
  const [selectedTab, setSelectedTab] = useState(0);
  const greenBeltAcres = useMemo(() => {
    return Math.floor(
      dp.features.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.properties.AREA_HA,
        0,
      ),
    );
  }, []);

  const casulties = useMemo(() => {
    return Math.floor(
      accidents.features.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.properties.NUMBER_OF_CASUALTIES,
        0,
      ),
    );
  }, []);

  const listOfAccidents: unknown = [];

  function getIcon(url: string, width: number, height: number) {
    return new L.Icon({
      iconUrl: url,
      iconRetinaUrl: "/cctv.png",
      iconSize: new L.Point(width, height),
    });
  }

  const accidentIcon = getIcon("/accident.png", 30, 30);
  const cctvIcon = getIcon("/cctv.png", 30, 30);
  const bycicle = getIcon("/bycicle.png", 40, 40);

  const changeMarker = (feature, latlng, icon) => {
    return L.marker(latlng, { icon: icon });
  };

  function customizeTooltip(arg: { seriesName: string; valueText: number }) {
    return {
      text: `Number of accidents: ${Math.floor(arg.valueText)}`,
    };
  }

  const geo: FeatureCollection = accidents;

  geo.features.forEach((value) => {
    listOfAccidents.push(value.properties);
  });
  const filter = geo.features.filter((value) => {
    return value.properties.ACCIDENT_SEVERITY == "Fatal";
  });

  const values = useMemo(() => {
    const counts = {};

    const aggreagationFields = [
      "DAY_OF_WEEK",
      "ROAD_SURFACE_CONDITIONS",
      "ACCIDENT_SEVERITY",
    ];
    const helper = {};

    for (const record of listOfAccidents) {
      for (const field of aggreagationFields) {
        counts[record[field]] = counts[record[field]]
          ? counts[record[field]] + 1
          : 1;
        helper[field] = helper[field]
          ? helper[field].add(record[field])
          : new Set<string>([record[field]]);
      }
    }

    const returnArray = [];
    for (const field of aggreagationFields) {
      const someArray = [];
      const set: Set<string> = helper[field];
      set.forEach((value) => {
        someArray.push({ label: value, value: counts[value] });
      });
      returnArray.push(someArray);
    }

    return returnArray;
  }, []);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortDays = function (a, b) {
    a = days.indexOf(a.label);
    b = days.indexOf(b.label);
    return a - b;
  };

  return (
    <div className={styles.urbanContainer}>
      <div className={styles.left_side}>
        <Tabs
          className={styles.tabs}
          defaultSelectedIndex={selectedTab}
          dataSource={[
            "Facts",
            "Accidents by day of the week",
            "Accidents by road conditions",
            "Accidents by severity",
          ]}
          onItemClick={(e) => setSelectedTab(e.itemIndex)}
        />
        {selectedTab === 0 && (
          <>
            <div className={styles.infoCard}>
              <h2>There are {cctvCount} live CCTVs around Glasgow</h2>
            </div>

            <div className={styles.infoCard}>
              <h2>
                There are {greenBeltAcres} acres of green belt areas around
                Glasgow
              </h2>
            </div>
            <div className={styles.infoCard}>
              <h2>
                There were {casulties} casulties across{" "}
                {accidents.features.length} accidents
              </h2>
            </div>
          </>
        )}

        {selectedTab === 1 && (
          <div className={styles.chart}>
            <Chart id="chart" dataSource={values[0].sort(sortDays)}>
              <ChartSeries
                valueField="value"
                argumentField="label"
                name="Accidents by days of the week"
                type="bar"
                color="#ffaa66"
              />
              <Legend verticalAlignment="bottom" horizontalAlignment="center" />
              <Tooltip
                enabled={true}
                location="edge"
                customizeTooltip={customizeTooltip}
              />
            </Chart>
          </div>
        )}

        {selectedTab === 2 && (
          <div className={styles.chart}>
            <PieChart
              dataSource={values[1].sort(sortDays)}
              palette="Material"
              title="Accidents by road conditions"
              resolveLabelOverlapping={"shift"}
            >
              <Series argumentField="label" valueField="value">
                <Label visible={true}>
                  <Connector visible={true} width={1} />
                </Label>
              </Series>

              <Export enabled={true} />
              <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            </PieChart>
          </div>
        )}

        {selectedTab === 3 && (
          <div className={styles.chart}>
            <PieChart
              dataSource={values[2]}
              palette="Material"
              title="Severity"
              resolveLabelOverlapping={"shift"}
            >
              <Series argumentField="label" valueField="value">
                <Label visible={true}>
                  <Connector visible={true} width={1} />
                </Label>
              </Series>

              <Export enabled={true} />
              <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            </PieChart>
          </div>
        )}
      </div>
      <div className={styles.mapDiv}>
        <div className={styles.myContainer}>
          <MapContainer center={[55.860916, -4.251433]} zoom={11.75}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LayersControl>
              <LayerGroup>
                <LayersControl.Overlay name={"CCTVs"}>
                  <GeoJSON
                    data={cctv}
                    pointToLayer={(f, l) => changeMarker(f, l, cctvIcon)}
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay name={"Wards"}>
                  <GeoJSON data={ward} />
                </LayersControl.Overlay>
                <LayersControl.Overlay name={"Lethal road accidents"}>
                  <GeoJSON
                    data={filter}
                    pointToLayer={(f, l) => changeMarker(f, l, accidentIcon)}
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay
                  name={"Automated bycicle rental stations"}
                >
                  <GeoJSON
                    data={cycle}
                    pointToLayer={(f, l) => changeMarker(f, l, bycicle)}
                  />
                </LayersControl.Overlay>
                <LayersControl.Overlay name={"Green belt areas"}>
                  <GeoJSON
                    data={dp}
                    style={{
                      color: "green",
                    }}
                  />
                </LayersControl.Overlay>
              </LayerGroup>
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default UrbanInfoDashboard;
