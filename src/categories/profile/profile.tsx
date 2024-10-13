import React, { useState } from "react";
import styles from "./profile.module.css";
import { motion } from "framer-motion";
import Card from "@/categories/profile/Card/card";
import { Cell, Input, TabsList } from "@telegram-apps/telegram-ui";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";
import HeroIconPNG from "@/components/Icons/heroIcon/heroIconPNG";

interface ProfileCategoryProps {
    fadeIn: any;
}

const ProfileCategory: React.FC<ProfileCategoryProps> = ({ fadeIn }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [currentSkin, setCurrentSkin] = useState(0); // Индекс текущего скина

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
                <Input />
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
