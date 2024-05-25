import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <div id="navigation-bar" className="navigation-bar">
                <div className="logo">E-COMMERCE EXAMPLE</div>
                <input className="search" type="text" placeholder="Search"/>
                <span className="hamburger-menu">
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
                </span>
                <ul className="navigation-list">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/cart">Cart</Link>
                </li>
                <li>
                    <Link to="/login">Account</Link>
                </li>
                <li>
                    <Link to="#">About</Link>
                </li>
                <li>
                    <Link to="#">Contact</Link>
                </li>
                </ul>
            </div>
        </>
    )
}

export default NavBar;