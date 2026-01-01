import { useEffect, useState, useContext } from 'react';
import type { JSX } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';
import { EditModeContext } from '@/features/admin/context/EditModeContext';
import { supabase } from '@/supabaseClient';
import { CommentBox } from '@/shared/components';
import styles from './Reviews.module.css';

type Review = {
    id: number;
    author_name: string;
    rating: number;
    comment: string;
    created_at: string;
};

const ReviewSite = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const { isEditing } = useContext(EditModeContext);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase.from('reviews').select('*');
                if (error) {
                    throw new Error('Network response was not ok');
                }
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return parseFloat((total / reviews.length).toFixed(1));
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            if (distribution[review.rating as keyof typeof distribution] !== undefined) {
                distribution[review.rating as keyof typeof distribution]++;
            }
        });
        return distribution;
    };

    const getRatingPercentage = (count: number) => {
        return reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    };

    const renderStars = (rating: number) => {
        return (
            <div className={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={i < Math.round(rating) ? styles.starFilled : styles.starEmpty}
                    />
                ))}
            </div>
        );
    };

    const getFullStars = (count: number) => {
        let el: JSX.Element[] = [];
        for (let i = 0; i < count; i++) {
            el.push(<FaStar key={i} className={styles.starFilled} />);
        }
        for (let i = count; i < 5; i++) {
            el.push(<FaStar key={i + 5} className={styles.starEmpty} />);
        }
        return el;
    }

    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm('Möchtest du diese Rezension wirklich löschen?')) {
            return;
        }

        try {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) {
                throw error;
            }
            setReviews(reviews.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Fehler beim Löschen der Rezension');
        }
    };

    return (
        <section className={styles.page}>
            <h1>Rezensionen der Eltern</h1>

            {reviews.length > 0 && (
                <section className={styles.summarySection}>
                    <div className={styles.summaryContent}>
                        <div className={styles.ratingBox}>
                            <p className={styles.ratingLabel}>Durchschnittliche Bewertung</p>
                            <div className={styles.ratingDisplay}>
                                <span className={styles.ratingValue}>{calculateAverageRating()}</span>
                                <span className={styles.maxRating}>/5</span>
                            </div>
                            {renderStars(calculateAverageRating())}
                            <p className={styles.reviewCount}>basierend auf {reviews.length} Bewertung{reviews.length !== 1 ? 'en' : ''}</p>
                        </div>
                        <div className={styles.distributionBox}>
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = getRatingDistribution()[rating as keyof ReturnType<typeof getRatingDistribution>];
                                const percentage = getRatingPercentage(count);
                                return (
                                    <div key={rating} className={styles.ratingRow}>
                                        <div className={styles.ratingRowLabel}>
                                            {getFullStars(rating)}
                                        </div>
                                        <div className={styles.barContainer}>
                                            <div
                                                className={styles.bar}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className={styles.percentage}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.section}>
                <div className={styles.sectionContent}>
                    {reviews.length === 0 ? (
                        <p className={styles.emptyState}>Es liegen noch keine Rezensionen vor.</p>
                    ) : (
                        <div className={styles.reviewsGrid}>
                            {reviews.map((review) => (
                                <div key={review.id} className={styles.reviewWrapper}>
                                    <CommentBox
                                        id={review.id.toString()}
                                        author_name={review.author_name}
                                        rating={review.rating}
                                        comment={review.comment}
                                        created_at={review.created_at}
                                    />
                                    {isEditing && (
                                        <button
                                            className={styles.deleteReviewButton}
                                            onClick={() => handleDeleteReview(review.id)}
                                            title="Rezension löschen"
                                            aria-label="Rezension löschen"
                                        >
                                            <FaTrash /> Löschen
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
};

export default ReviewSite;