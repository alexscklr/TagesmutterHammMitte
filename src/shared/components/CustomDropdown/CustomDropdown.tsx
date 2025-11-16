import { useState, useEffect, type JSX, type ReactNode } from "react";
import styles from "./CustomDropdown.module.css";

interface DropdownProps {
    title: ReactNode,
    options: JSX.Element[]
}

const CustomDropdown = ({ title, options }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const switchSelect = () => setIsOpen(prev => !prev);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            // Schließe Dropdown nur, wenn außerhalb geklickt wird
            if (!(e.target as HTMLElement).closest(`.${styles.select}`)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen]);

    return (
        <div className={styles.select}>
            <button
                className={styles.selectBtn}
                onClick={switchSelect}
                tabIndex={0}
            >
                {title} <span className={`${styles.arrow} ${isOpen ? styles.active : styles.inactive}`}>▲</span>
            </button>
            <ul className={`${isOpen ? styles.active : styles.inactive}`}>
                {options.map((el, index) => (
                    <li key={`${title}-${index}`} onClick={switchSelect}>{el}</li>
                ))}
            </ul>
        </div>
    );
}


export default CustomDropdown;