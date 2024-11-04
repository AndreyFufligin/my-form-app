import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => {
        return (
            <div className={styles.inputContainer}>
                <label>{label}</label>
                <input
                    ref={ref}
                    {...props}
                    className={`${styles.input} ${error ? styles.error : ''}`}
                />
                {error && <span className={styles.error}>{error}</span>}
            </div>
        );
    }
);

export default Input;




