import "./styles/header.css";
import { FiLogOut } from "react-icons/fi";
import logo from "../../../public/logo.png"



export default function Header({ name, avatar }) {

    function onLogout() {
        console.log("Hello")
    }

    return (
        <header className="dashboard-header">
            <img src={logo} alt="text to speech logo" style={{maxWidth: "50px"}}  />

            <div className="user-profile">
                <button className="logout-button" onClick={onLogout}>
                    <span>Guest</span>
                </button>
            </div>
        </header>
    );
}
