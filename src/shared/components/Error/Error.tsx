import styles from "./Error.module.css";

interface ErrorProps {
  message: string;
  details?: string;
}

const Error = ({ message, details }: ErrorProps) => (
  <div className={styles.errorWrapper}>
    <div className={styles.icon}>⚠️</div>
    <div className={styles.message}>{message}</div>
    {details && <div className={styles.details}>{details}</div>}
  </div>
);

export default Error;