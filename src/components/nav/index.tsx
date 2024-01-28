import {Link} from "react-router-dom";
import './index.css'

const Navbar = () => {
    return (
        <nav>
            <Link to="/">Rent Dashboard</Link>
            <Link to="/urban">Urban Info</Link>
            <Link to="/heat">Heat Map</Link>
        </nav>
    )

}

export default Navbar;
