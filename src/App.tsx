import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {MyMap} from "./components/map";
import {MyChart} from "./components/charts";
import {MyGauge} from "./components/gauges";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1>Mockup</h1>
                <MyMap/>
        </>
    )
}

export default App
