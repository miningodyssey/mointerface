import React, { useState } from "react";
import styles from "./profile.module.css";
import { motion } from "framer-motion";
import Card from "@/categories/profile/Card/card";
import { Cell, Input, TabsList, Button } from "@telegram-apps/telegram-ui";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";
import HeroIconPNG from "@/components/Icons/heroIcon/heroIconPNG";
import CheckIcon from "@/components/Icons/CheckIcon/checkIcon";
import { Icon28Edit } from "@telegram-apps/telegram-ui/dist/icons/28/edit";
import {updateUser} from "@/components/functions/updateNickname";


interface ProfileCategoryProps {
    fadeIn: any;
    userData: any;  // Тип для данных пользователя
    setUserData: (data: any) => void;  // функция для обновления данных
    token?: string;  // Добавляем token для авторизации
}

const ProfileCategory: React.FC<ProfileCategoryProps> = ({ fadeIn, userData, setUserData, token }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false); // Состояние для редактирования
    const [currentSkin, setCurrentSkin] = useState(0); // Индекс текущего скина
    const [nicknameInput, setNicknameInput] = useState(userData.nickname); // Промежуточное состояние для никнейма

    // Функция для отправки запроса на обновление пользователя

    // Обработчик для отслеживания изменений в поле ввода никнейма
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNicknameInput(e.target.value);
    };

    const handleEditClick = async () => {
        if (isEditing && nicknameInput !== userData.nickname && token) {
            // Обновляем данные пользователя с новым никнеймом
            const updatedUserData = { ...userData, nickname: nicknameInput };
            const updatedData = await updateUser(updatedUserData, token);
            setUserData(updatedData);
        }
        // Меняем состояние редактирования
        setIsEditing(!isEditing);
    };

    const handleCardClick = (index: number) => {
        setCurrentSkin(index); // Устанавливаем выбранную карточку
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.profileContainer}
        >
            <div className={styles.nickInput}>
                <div className={styles.inputWrapper}>
                    <Input
                        value={nicknameInput}
                        onChange={handleNicknameChange}
                        className={styles.inputWithButton}
                        placeholder="Enter your nickname"
                        defaultValue={userData.nickname}
                        disabled={!isEditing}
                    />
                    <Button className={styles.saveButton} onClick={handleEditClick} style={{borderRadius: '14px'}}>
                        {isEditing ? <CheckIcon /> : <Icon28Edit />} {/* Меняем иконку */}
                    </Button>
                </div>
            </div>
            <div className={styles.skinContainer}>
                <Card
                    image={<HeroIconPNG />}
                    title={`Skin ${currentSkin + 1}`} // Текущий скин
                    subtitle={'Current skin'}
                />
                <div className={styles.CellsContainer}>
                    <Cell
                        className={styles.Cell}
                        before={<div><CoinIcon /></div>}
                        subtitle={<div style={{ color: 'green' }}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={<div><LightningIcon /></div>}
                        subtitle={<div style={{ color: 'green' }}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={<div><CoinIcon /></div>}
                        subtitle={<div style={{ color: 'green' }}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                        </div>
                    </Cell>
                </div>
            </div>
            <div style={{ height: '42px', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <TabsList style={{ width: '90%', height: '100%' }}>
                    <TabsList.Item selected={currentTab === 0} onClick={() => setCurrentTab(0)}>
                        Skins
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 1} onClick={() => setCurrentTab(1)}>
                        Levels
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 2} onClick={() => setCurrentTab(2)}>
                        Power-ups
                    </TabsList.Item>
                </TabsList>
            </div>
            {
                currentTab === 0 && (
                    <div className={styles.cardsContainer}>
                        {[...Array(12)].map((_, index) => (
                            <div className={styles.card} key={index}>
                                <Card
                                    image={<HeroIconPNG />}
                                    title={`Skin ${index + 1}`}
                                    subtitle={`Skin description ${index + 1}`}
                                    selected={currentSkin === index} // Выделяем карточку, если она выбрана
                                    selectable
                                    onClick={() => handleCardClick(index)} // Обновляем текущий скин
                                />
                            </div>
                        ))}
                    </div>
                )
            }
        </motion.div>
    );
};

export default ProfileCategory;
