'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import styles from './analysis.module.css';



function generateMockData(idea) {
    return {
        grade: 'B+',
        gradeColor: '#c8f542',
        summary: 'Moderate originality detected. Your concept shows promise but overlaps with several existing projects in the facial recognition attendance space. Differentiating your methodology will strengthen your submission.',
        scores: [
            { label: 'Originality score', value: 70, color: '#c8f542' },
            { label: 'Research uniqueness', value: 64, color: '#a78bfa' },
            { label: 'Keyword freshness', value: 81, color: '#67e8f9' },
            { label: 'Implementation novelty', value: 55, color: '#fb923c' },
        ],
        flags: [
            { type: 'warn', text: '5 similar projects found in archive (2021–2023)' },
            { type: 'warn', text: '11 overlapping keywords detected' },
            { type: 'info', text: 'Your edge-computing angle is underexplored — lean into it' },
            { type: 'good', text: 'No binary copy matches found' },
        ],
        similar: [
            { title: 'Smart Attendance via Face Recognition', year: '2022', match: '68%' },
            { title: 'Automated Lecture Monitoring System', year: '2021', match: '54%' },
            { title: 'IoT + CV Classroom Analytics', year: '2023', match: '41%' },
        ],
        introduction: `This project proposes the development of an AI-driven attendance management system leveraging facial recognition technology for higher education institutions. The system aims to automate the traditionally manual process of student attendance tracking, reducing administrative overhead and improving data accuracy. By deploying lightweight convolutional neural networks optimised for edge inference, the proposed solution operates in real time within constrained computational environments, addressing the scalability concerns prevalent in existing literature.`,
        methodology: `The system architecture follows a three-tier pipeline: (1) Image Acquisition — frames are captured via standard USB or IP cameras mounted at lecture theatre entry points; (2) Feature Extraction — a MobileNetV3 backbone pre-trained on a curated academic face dataset extracts 128-dimensional embeddings; (3) Identity Matching — cosine similarity against a registered student database with a configurable confidence threshold triggers attendance logging. Ground truth validation will be conducted using a dataset of 2,400 student images across 12 departments.`,
        keywords: [
            'edge inference', 'MobileNetV3', 'cosine similarity', 'attendance automation',
            'convolutional neural network', 'real-time recognition', 'lecture analytics',
            'privacy-preserving biometrics', 'embedded deployment',
        ],
        starterCode: `// attendance-system/src/recognition/pipeline.js

import * as faceapi from 'face-api.js';

const CONFIDENCE_THRESHOLD = 0.62;

/**
 * Loads face-api models from the /models directory.
 * Call this once on app init.
 */
export async function loadModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ]);
  console.log('[Litmus] Face models loaded ✓');
}

/**
 * Runs face detection + recognition on a video frame.
 * @param {HTMLVideoElement} videoEl  Live camera feed
 * @param {LabeledFaceDescriptors[]} knownFaces  Registered students
 * @returns {{ label: string, distance: number }[]}
 */
export async function detectAndMatch(videoEl, knownFaces) {
  const detections = await faceapi
    .detectAllFaces(videoEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  const matcher = new faceapi.FaceMatcher(knownFaces, CONFIDENCE_THRESHOLD);

  return detections.map((d) => {
    const match = matcher.findBestMatch(d.descriptor);
    return { label: match.label, distance: match.distance };
  });
}`,
    };
}


function ScoreBar({ label, value, color, delay }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <div className={styles.scoreRow} ref={ref}>
            <div className={styles.scoreTop}>
                <span className={styles.scoreLabel}>{label}</span>
                <span className={styles.scoreValue} style={{ color }}>{value}%</span>
            </div>
            <div className={styles.scoreTrack}>
                <motion.div
                    className={styles.scoreFill}
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${value}%` } : {}}
                    transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    );
}

// ─── Flag item ─────────────────────────────────────────────────────────────────

const FLAG_STYLES = {
    warn: { bg: 'rgba(251, 146, 60, 0.08)', border: 'rgba(251, 146, 60, 0.2)', icon: '⚠', color: '#fb923c' },
    info: { bg: 'rgba(103, 232, 249, 0.06)', border: 'rgba(103, 232, 249, 0.15)', icon: '●', color: '#67e8f9' },
    good: { bg: 'rgba(200, 245, 66, 0.06)', border: 'rgba(200, 245, 66, 0.15)', icon: '✓', color: '#c8f542' },
};

function Flag({ type, text }) {
    const s = FLAG_STYLES[type];
    return (
        <div
            className={styles.flag}
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
        >
            <span style={{ color: s.color, fontSize: '0.8rem' }}>{s.icon}</span>
            <span className={styles.flagText}>{text}</span>
        </div>
    );
}

// ─── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({ title, tag, children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <motion.div
            ref={ref}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{title}</h2>
                {tag && <span className={styles.cardTag}>{tag}</span>}
            </div>
            {children}
        </motion.div>
    );
}


export default function AnalysisPage() {
    const [data, setData] = useState(null);
    const [idea, setIdea] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = typeof window !== 'undefined'
            ? localStorage.getItem('litmus_idea') || 'AI-powered attendance system using facial recognition for university lectures.'
            : 'AI-powered attendance system using facial recognition.';
        setIdea(stored);
        setData(generateMockData(stored));
    }, []);

    function copyCode() {
        if (!data) return;
        navigator.clipboard.writeText(data.starterCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (!data) return (
        <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
        </div>
    );

    return (
        <div className={styles.root}>
            <div className={styles.glow} aria-hidden />

            {/* ── Top bar ── */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLogo}>litmus</Link>
                <div className={styles.navCenter}>
                    <span className={styles.navIdea}>"{idea.slice(0, 60)}{idea.length > 60 ? '...' : ''}"</span>
                </div>
                <Link href="/chat" className={styles.navRetry}>Try another idea ↗</Link>
            </nav>

            <main className={styles.main}>

                {/* ── Grade Hero ── */}
                <motion.section
                    className={styles.gradeHero}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className={styles.gradeLeft}>
                        <motion.div
                            className={styles.gradeCircle}
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
                        >
                            {data.grade}
                        </motion.div>
                        <div>
                            <p className={styles.gradeLabel}>Originality grade</p>
                            <h1 className={styles.gradeTitle}>Moderate originality detected</h1>
                            <p className={styles.gradeSummary}>{data.summary}</p>
                        </div>
                    </div>

                    <div className={styles.gradeScores}>
                        {data.scores.map((s, i) => (
                            <ScoreBar key={s.label} {...s} delay={i * 0.07} />
                        ))}
                    </div>
                </motion.section>

                {/* ── Grid ── */}
                <div className={styles.grid}>

                    {/* Flags */}
                    <SectionCard title="Scan findings" tag="4 items" delay={0.05}>
                        <div className={styles.flags}>
                            {data.flags.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.07 }}
                                >
                                    <Flag {...f} />
                                </motion.div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Similar projects */}
                    <SectionCard title="Similar projects found" tag="archive" delay={0.1}>
                        <div className={styles.similar}>
                            {data.similar.map((p, i) => (
                                <div key={i} className={styles.similarRow}>
                                    <div>
                                        <p className={styles.similarTitle}>{p.title}</p>
                                        <p className={styles.similarYear}>{p.year}</p>
                                    </div>
                                    <span
                                        className={styles.similarMatch}
                                        style={{
                                            color: parseInt(p.match) > 60 ? '#fb923c' : '#c8f542',
                                            background: parseInt(p.match) > 60 ? 'rgba(251,146,60,0.08)' : 'rgba(200,245,66,0.06)',
                                        }}
                                    >
                                        {p.match}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Introduction */}
                    <SectionCard title="Introduction draft" tag="generated" delay={0.15}>
                        <p className={styles.prose}>{data.introduction}</p>
                    </SectionCard>

                    {/* Methodology */}
                    <SectionCard title="Methodology" tag="generated" delay={0.18}>
                        <p className={styles.prose}>{data.methodology}</p>
                    </SectionCard>

                    {/* Keywords */}
                    <SectionCard title="Suggested keywords" tag={`${data.keywords.length} terms`} delay={0.2}>
                        <div className={styles.keywords}>
                            {data.keywords.map((kw, i) => (
                                <motion.span
                                    key={kw}
                                    className={styles.keyword}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.35 + i * 0.04 }}
                                >
                                    {kw}
                                </motion.span>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Starter Code */}
                    <SectionCard title="Starter code" tag="JavaScript" delay={0.22}>
                        <div className={styles.codeWrap}>
                            <div className={styles.codeBar}>
                                <span className={styles.codeFile}>pipeline.js</span>
                                <button className={styles.copyBtn} onClick={copyCode}>
                                    {copied ? '✓ Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre className={styles.code}><code>{data.starterCode}</code></pre>
                        </div>
                    </SectionCard>

                </div>
            </main>
        </div>
    );
}