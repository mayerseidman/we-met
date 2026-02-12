import Link from "next/link";
import styles from "../styles/components/ScanQR.module.scss";

export default function ScanQR() {
    return (
        <div className={styles.scanQr}>
            <h1 className={styles.scanHeading}>Scan QR</h1>
            <p className={styles.scanSubtext}>
                Scan someone&apos;s QR code to add them to your connections
            </p>
            <Link href="/scan" className={styles.openCameraBtn}>
                Open Camera
            </Link>
        </div>
    );
}