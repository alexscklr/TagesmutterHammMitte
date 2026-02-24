

import { FaStar } from 'react-icons/fa';
import styles from './CommentBox.module.css';

type CommentBoxProps = {
    id: string;
    author_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

const CommentBox = (props: CommentBoxProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={i < rating ? styles.starFilled : styles.starEmpty}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{props.author_name}</h3>
                    <p className={styles.date}>{formatDate(props.created_at)}</p>
                </div>
                {renderStars(props.rating)}
            </div>
            <p className={styles.comment}>{props.comment}</p>
        </div>
    );
}

export default CommentBox;