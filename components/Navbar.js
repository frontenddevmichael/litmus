"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.nav}>
            <div className="container">
                <div className={styles.inner}>
                    <Link href="/" className={styles.logo}>litmus</Link>
                    <div className={styles.links}>
                        <Link href="/#features" className={pathname === '/' ? styles.active : ''}>Features</Link>
                        <Link href="/chat" className="btn-primary">Get Started ↗</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}