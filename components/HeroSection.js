import Link from "next/link";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <span className="badge">✦ AI-Powered Academic Validator</span>
                <h1 className={styles.title}>
                    Your final-year project idea, <span className={styles.accentText}>scored before you build.</span>
                </h1>
                <p className={styles.description}>
                    Validate your idea instantly. Check originality against past submissions and get a graded score to start your build with confidence.
                </p>
                <div className={styles.buttonGroup}>
                    <Link href="/chat" className="btn-primary">Validate my idea ↗</Link>
                    <button className="btn-secondary">View Sample Report</button>
                </div>
            </div>
        </section>
    );
}