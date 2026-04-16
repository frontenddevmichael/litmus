import styles from "./AnalysisCard.module.css";
// import { Copy } from "lucide-react";

export default function AnalysisCard({ title, content, isCode }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert("Copied to clipboard!");
    };

    return (
        <div className="card">
            <div className={styles.header}>
                <span className="mono">{title}</span>
                <button onClick={handleCopy} className={styles.copyBtn}>
                    {/* <Copy size={14} /> Copy */}
                </button>
            </div>
            {isCode ? (
                <pre className={styles.codeBlock}>
                    {/* <code>{content}</code> */}
                </pre>
            ) : (
                <p className={styles.textContent}>{content}</p>
            )}
        </div>
    );
}