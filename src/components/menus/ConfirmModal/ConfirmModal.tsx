import React from 'react';
import styles from './ConfirmModal.module.css'; // Подключите стили для модального окна

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Подтвердите покупку</h2>
                <p>Вы хотите купить эту карточку?</p>
                <button onClick={onConfirm}>Да</button>
                <button onClick={onClose}>Нет</button>
            </div>
        </div>
    );
};

export default ConfirmModal;
