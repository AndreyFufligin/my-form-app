import React, {FC} from 'react';
import styles from './Button.module.css'


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}
const Button: FC<ButtonProps> = ({label, ...props})=>{
    return (
        <button className={styles.button} {...props}>
            {label}
        </button>
    );
}

export default Button;