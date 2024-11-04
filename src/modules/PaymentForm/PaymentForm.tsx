import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/Input/Input';
import Popup from "../../components/Popup/Popup";
import Button from '../../ui/Button/Button';
import styles from './PaymentForm.module.css';
import { isValidCardNumber } from "../IsValidCardNamber/IsValidCardNumber";
import SHA256 from 'crypto-js/sha256';

interface PaymentFormData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    amount: string;
    name: string;
    message: string;
}

const PaymentForm: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue,reset } = useForm<PaymentFormData>();

    const initiatorName = "Иван К.";
    const fundraisingTitle = "Экскурсия";

    const onSubmit = (data: PaymentFormData) => {
        if (!isValidCardNumber(data.cardNumber)) {
            setPopupMessage("Номер карты не действителен");
            setShowPopup(true);
            return;
        }

        const generateHash = (apiKey: string, transactionId: string, amount: number, secretKey: string): string => {
            return SHA256(`${apiKey}${transactionId}${amount * 100}${secretKey}`).toString();
        };


        const transactionId = Date.now().toString();
        const apiKey = "316b2be8-3475-4462-bd57-c7794d4bdb53";
        const secretKey = "1234567890";
        const amountInCents = parseInt(data.amount);

        const hash_sum = generateHash(apiKey, transactionId, amountInCents, secretKey);



        const requestData = {
            api_key: apiKey,
            transaction: transactionId,
            description: data.message,
            amount: amountInCents,
            hash_sum,
            email: "",
            redirect_url: "",
            success_redirect: "",
            fail_redirect: "",
            custom_data: {
                initiatorName,
                fundraisingTitle,
            },
        };

        console.log(requestData);
        const isSuccess = true;

        if (isSuccess) {
            setPopupMessage("Данные успешно отправлены!");
            setShowPopup(true);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    const handleReturn = () => {
        reset();
        setShowPopup(false);
        setPopupMessage('');
    };

    const handleExpiryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
        const month = formattedValue.slice(0, 2);
        const year = formattedValue.slice(2, 4);

        setValue('expiryDate', month.length === 2 && year.length ? `${month}/${year}` : formattedValue);
    };

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('cardNumber', value.replace(/\s/g, ''));
    };

    const handleCvvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('cvv', value.replace(/\D/g, ''));
    };

    return (<>
        {showPopup && <Popup message={popupMessage} onClose={handleClosePopup} />}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2>{`${initiatorName} собирает на «${fundraisingTitle}»`}</h2>
            <Input
                label="Номер карты"
                maxLength={16}
                {...register('cardNumber', {
                    required: 'Введите номер карты',
                    onChange: handleCardNumberChange
                })}
                error={errors.cardNumber?.message}
            />
            <Input
                label="Срок действия (ММ/ГГ)"
                placeholder="ММ/ГГ"
                {...register('expiryDate', {
                    required: 'Введите срок',
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Введите правильный срок' },
                    onChange: handleExpiryChange
                })}
                error={errors.expiryDate?.message}
            />
            <Input
                label="CVV"
                placeholder="***"
                maxLength={3}
                {...register('cvv', {
                    required: 'Введите CVV',
                    pattern: { value: /^\d{3}$/, message: 'Введите 3 цифры' },
                    onChange: handleCvvChange
                })}
                error={errors.cvv?.message}
            />
            <Input
                label="Сумма перевода (₽)"
                maxLength={16}
                placeholder="500₽"
                {...register('amount', {
                    required: 'Введите сумму',
                    validate: value => {
                        const numericValue = parseFloat(value.replace(/[₽]/, ''));
                        return !isNaN(numericValue) && numericValue >= 10 || 'Сумма должна быть не менее 10 рублей';
                    }
                })}
                error={errors.amount?.message}
            />
            <Input
                label="Ваше имя"
                maxLength={50}
                {...register('name', { required: 'Введите имя' })}
                error={errors.name?.message}
            />
            <Input
                label="Сообщение получателю"
                maxLength={50}
                defaultValue="Экскурсия"
                {...register('message')}
            />
            <div className={styles.buttons}>
                <Button label="Перевести" type="submit" />
                <Button label="Вернуться" type="button" onClick={handleReturn}/>
            </div>
        </form>

        </>
    );
};

export default PaymentForm;
