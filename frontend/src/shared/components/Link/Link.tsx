import { FaExternalLinkAlt } from "react-icons/fa";
import { Link as RouterLink } from "react-router";
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
    const isInternalRoute = !isExternal && href.startsWith("/");

    if (isInternalRoute) {
        return (
            <RouterLink
                className={`${styles.link} ${anchorClass}`}
                to={href}
                aria-label={ariaLabel}
                aria-description={ariaDescription}
            >
                {children}
            </RouterLink>
        );
    }

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