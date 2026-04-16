import styles from "./GradeDisplay.module.css";

export default function GradeDisplay({ grade, score }) {
    // Determine color based on grade
    const getGradeClass = (g) => {
        if (g.startsWith('A')) return 'grade-a';
        if (g.startsWith('B')) return 'grade-b';
        if (g.startsWith('C')) return 'grade-c';
        return 'grade-f';
    };

    return (
        <div className="card">
            <div className={styles.flexContainer}>
                <div className={`${styles.largeLetter} ${getGradeClass(grade)}`}>
                    {grade}
                </div>
                <div className={styles.scoreDetails}>
                    <h3>Originality Score</h3>
                    <div className={styles.barTrack}>
                        <div
                            className={styles.barFill}
                            style={{ width: `${score}%`, backgroundColor: `var(--${getGradeClass(grade)})` }}
                        ></div>
                    </div>
                    <p className="mono">{score}% Unique</p>
                </div>
            </div>
        </div>
    );
}