import "./App.css";
import "devextreme/dist/css/dx.dark.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RentDashboard from "./pages/Rent";
import HeatMapPage from "./pages/HeatMapPage";
import Navbar from "./components/nav";
import UrbanInfoDashboard from "./pages/UrbanInfo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route index element={<RentDashboard />} />
            <Route path="heat" element={<HeatMapPage />} />
            <Route path="urban" element={<UrbanInfoDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
