import Papa from 'papaparse'

type TestEntry = {
    wardname: string;
    value: number;
}

export interface RentData {
    objectid: number,
    ward: string,
    monthOfReportingDate: number,
    bedrooms: number,
    city: string,
    aggBedrooms: number,
    furnished: string,
    propertyTypeBasic: string,
    postcodeDistrict: string,
    reportingDate: number,
    rent: number,
    year: number,
    yearlyQuarter: string,
    qtrAveAllRooms: number,
    shapearea: number,
    shapelen: number

}


const DataProvider = {
    getRentData() {
        return new Promise((resolve, reject) => {
                return Papa.parse<RentData>("/Citylets.csv", {
                    download: true,
                    header: true,
                    dynamicTyping: true,
                    complete: resolve,//resolve the promise when complete
                    error: reject//reject the promise if there is an error
                });
            }
        )
    }
}

export default DataProvider