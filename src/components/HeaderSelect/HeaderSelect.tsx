import { Link } from "react-router-dom";
import type { HeaderSelectType } from "../../types/types";
import { useState } from "react";
import "./HeaderSelect.css";


interface HeaderSelectProps {
    title: string,
    options: HeaderSelectType[]
}

const HeaderSelect = ({ title, options }: HeaderSelectProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const switchSelect = () => {
        setIsOpen(prev => !prev);
    }

    return (
        <div className="header-select">
            <button className="header-select-btn" onClick={switchSelect}>{title} {isOpen ? ("▲") : ("▼")}</button>
            <ul className={`${isOpen ? "active" : "inactive"}`}>
                {options.map((el, index) => (
                    <li key={index}><Link to={el.path} onClick={switchSelect}>{el.name}</Link></li>
                ))}
            </ul>

        </div>

    );
}

export default HeaderSelect;