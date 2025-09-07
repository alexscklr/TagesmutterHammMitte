import { useState, type JSX } from "react";
import "./CustomDropdown.css";


interface DropdownProps {
    title: string,
    options: JSX.Element[]
}

const CustomDropdown = ({ title, options }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const switchSelect = () => {
        setIsOpen(prev => !prev);
    }

    return (
        <div className="header-select">
            <button className="header-select-btn" onClick={switchSelect}>{title} {isOpen ? ("▲") : ("▼")}</button>
            <ul className={`${isOpen ? "active" : "inactive"}`}>
                {options.map((el, index) => (
                    <li key={index} onClick={switchSelect}>{el}</li>
                ))}
            </ul>

        </div>

    );
}

export default CustomDropdown;