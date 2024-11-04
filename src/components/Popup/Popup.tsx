import React from 'react';
import styles from './Popup.module.css';
interface PopupProps {
    message: string;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
    return (
        <div className={styles.popup}>
            <div className={styles.popupContent}>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Popup;
