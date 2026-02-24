import { FaExternalLinkAlt } from "react-icons/fa";
import styles from "./Link.module.css";


interface LinkProps {
    href: string;
    isExternal?: boolean;
    anchorClass?: string;
    ariaLabel?: string;
    ariaDescription?: string;
    children: React.ReactNode;
};

const Link = ({ href, isExternal, anchorClass, ariaLabel, ariaDescription, children }: LinkProps) => {

    return (
        <a
            className={`${styles.link} ${anchorClass}`}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={ariaLabel}
            aria-description={ariaDescription}
        >
            {children} {isExternal && <FaExternalLinkAlt />}
        </a >
    );
}

export default Link;