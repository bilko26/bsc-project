import Papa from "papaparse";
export interface RentData {
  objectid: number;
  ward: string;
  monthOfReportingDate: number;
  bedrooms: number;
  city: string;
  aggBedrooms: number;
  furnished: string;
  propertyTypeBasic: string;
  postcodeDistrict: string;
  reportingDate: number;
  rent: number;
  year: number;
  yearlyQuarter: string;
  qtrAveAllRooms: number;
  shapearea: number;
  shapelen: number;
}

const DataProvider = {
  getRentData() {
    return new Promise((resolve, reject) => {
      return Papa.parse<RentData>("/Citylets.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: resolve,
        error: reject,
      });
    });
  },
};

export default DataProvider;
