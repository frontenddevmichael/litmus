'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './Navbar.module.css';

// ─── Nav Data ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
    {
        label: 'How it works',
        panel: 'how',
        items: [
            { title: 'Paste your idea', sub: 'Drop a title or abstract, plain text works fine' },
            { title: 'Keyword scan', sub: 'Core terms matched against your school archive' },
            { title: 'Get a grade', sub: 'A–F originality score delivered in under 3s' },
            { title: 'Generate assets', sub: 'Starter code, methodology, and fresh keywords' },
        ],
    },
    {
        label: 'Features',
        panel: 'features',
        items: [
            { title: 'Originality scanner', sub: 'Keyword + binary match against 12k+ projects' },
            { title: 'Letter grade scoring', sub: 'Clear A–F so you know exactly where you stand' },
            { title: 'Starter code gen', sub: 'Boilerplate matched to your project domain' },
            { title: 'AI chat support', sub: 'Refine your idea through conversation' },
        ],
    },
    {
        label: 'Docs',
        panel: 'docs',
        items: [
            { title: 'Quickstart guide', sub: 'Up and running in under 5 minutes' },
            { title: 'API reference', sub: 'Integrate Litmus into your own toolchain' },
            { title: 'Scoring explained', sub: 'How the A–F grade is calculated' },
        ],
    },
];

// ─── Chevron Icon ──────────────────────────────────────────────────────────────

function Chevron({ open }) {
    return (
        <motion.svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={styles.chevron}
        >
            <polyline points="1,2 4,6 7,2" />
        </motion.svg>
    );
}

// ─── Nav Panel ─────────────────────────────────────────────────────────────────

function NavPanel({ item, visible }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={styles.panel}
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className={styles.panelLabel}>{item.label}</p>
                    {item.items.map((p, i) => (
                        <motion.a
                            key={p.title}
                            href="#"
                            className={styles.panelItem}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                        >
                            <span className={styles.panelDot} />
                            <span className={styles.panelText}>
                                <span className={styles.panelTitle}>{p.title}</span>
                                <span className={styles.panelSub}>{p.sub}</span>
                            </span>
                        </motion.a>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Mobile Menu ───────────────────────────────────────────────────────────────

function MobileMenu({ open, onClose }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className={styles.mobileMenu}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    {NAV_ITEMS.map((item) => (
                        <div key={item.panel} className={styles.mobileSection}>
                            <p className={styles.mobileSectionLabel}>{item.label}</p>
                            {item.items.map((p) => (
                                <a key={p.title} href="#" className={styles.mobilePanelItem} onClick={onClose}>
                                    <span className={styles.panelDot} />
                                    <span className={styles.mobilePanelTitle}>{p.title}</span>
                                </a>
                            ))}
                        </div>
                    ))}
                    <div className={styles.mobileCtaRow}>
                        <Link href="/chat" className={styles.ctaPrimary} onClick={onClose}>
                            Get started ↗
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Main Nav ──────────────────────────────────────────────────────────────────

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [activePanel, setActivePanel] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);
    const leaveTimer = useRef(null);


    // Close panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setActivePanel(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);


    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 40);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLinkEnter = useCallback((panel) => {
        clearTimeout(leaveTimer.current);
        setActivePanel(panel);
    }, []);

    const handleNavLeave = useCallback(() => {
        leaveTimer.current = setTimeout(() => setActivePanel(null), 120);
    }, []);

    const handlePanelEnter = useCallback(() => {
        clearTimeout(leaveTimer.current);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
            onMouseLeave={handleNavLeave}
        >
            {/* ── Inner pill ── */}
            <div className={`${styles.pill} ${scrolled ? styles.pillScrolled : ''}`}>

                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    litmus
                    <span className={styles.logoMark}>◎</span>
                </Link>

                {/* Desktop links */}
                <ul className={styles.links}>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.panel} className={styles.linkWrap}>
                            <button
                                className={`${styles.link} ${activePanel === item.panel ? styles.linkActive : ''}`}
                                onMouseEnter={() => handleLinkEnter(item.panel)}
                            >
                                {item.label}
                                <Chevron open={activePanel === item.panel} />
                            </button>

                            <div onMouseEnter={handlePanelEnter}>
                                <NavPanel
                                    item={item}
                                    visible={activePanel === item.panel}
                                />
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Right cluster */}
                <div className={styles.right}>
                    {/* Status badge — hidden when scrolled to save space */}
                    <div className={`${styles.status} ${scrolled ? styles.statusHidden : ''}`}>
                        <span className={styles.statusDot} />
                        <span className={styles.statusText}>All systems go</span>
                    </div>

                    <Link href="/chat" className={styles.cta}>
                        Get started ↗
                    </Link>

                    {/* Hamburger */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label="Toggle menu"
                    >
                        <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }} transition={{ duration: 0.2 }} />
                        <motion.span animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
                        <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }} transition={{ duration: 0.2 }} />
                    </button>
                </div>
            </div>

            {/* Mobile menu — drops below pill */}
            <div className={styles.mobileMenuWrap}>
                <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
            </div>
        </nav>
    );
}