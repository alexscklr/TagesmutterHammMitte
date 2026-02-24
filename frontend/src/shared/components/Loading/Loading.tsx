import styles from "./Loading.module.css";

const Loading = () => (
  <div className={styles.loadingWrapper}>
    <div className={styles.spinner}></div>
    <span className={styles.text}>Lädt ...</span>
  </div>
);

export default Loading;