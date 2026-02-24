import { useState, useEffect, useRef, type JSX, type ReactNode } from "react";
import styles from "./CustomDropdown.module.css";

interface DropdownProps {
    title: ReactNode,
    options: JSX.Element[],
    direction?: 'left' | 'right'
}

const CustomDropdown = ({ title, options, direction = 'right' }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const switchSelect = () => {
        setIsOpen(prev => !prev);
        // Blur button after click to prevent focus from jumping to first link
        if (buttonRef.current) {
            buttonRef.current.blur();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchSelect();
        } else if (e.key === 'Escape' && isOpen) {
            e.preventDefault();
            setIsOpen(false);
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // Schließe Dropdown, wenn außerhalb dieses spezifischen Dropdowns geklickt wird
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Schließe Dropdown bei Escape
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                if (buttonRef.current) {
                    buttonRef.current.focus();
                }
            }
        };

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleGlobalKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleGlobalKeyDown);
        };
    }, [isOpen]);

    return (
        <div className={styles.select} ref={dropdownRef}>
            <button
                ref={buttonRef}
                className={styles.selectBtn}
                onClick={switchSelect}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                {title} <span className={`${styles.arrow} ${isOpen ? styles.active : styles.inactive}`}>▲</span>
            </button>
            <ul className={`${isOpen ? styles.active : styles.inactive} ${direction === 'left' ? styles.dropLeft : styles.dropRight}`}>
                {options.map((el, index) => (
                    <li key={`${title}-${index}`} onClick={switchSelect}>{el}</li>
                ))}
            </ul>
        </div>
    );
}


export default CustomDropdown;