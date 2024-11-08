    import React, {useEffect, useRef, useState} from "react";
    import styles from "./profile.module.css";
    import { motion } from "framer-motion";
    import Card from "@/categories/profile/Card/card";
    import { Cell, Input, TabsList, Button, Placeholder, Modal } from "@telegram-apps/telegram-ui";
    import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
    import HeroIconPNG from "@/components/Icons/heroIcon/heroIconPNG";
    import CheckIcon from "@/components/Icons/CheckIcon/checkIcon";
    import { Icon28Edit } from "@telegram-apps/telegram-ui/dist/icons/28/edit";
    import { updateUser } from "@/components/functions/updateUser";
    import {updateCacheWithSelection} from "@/components/functions/updateCacheWithSelection";

    interface ProfileCategoryProps {
        fadeIn: any;
        userData: any;
        setUserData: (data: any) => void;
        token?: string;
        t: any;
        ref: any;
    }

    interface CardData {
        image: React.JSX.Element;
        title: string;
        subtitle: string;
        selected: boolean;
        purchased: boolean;
        selectable: boolean;
        cost: number; // Добавляем стоимость карточки
    }

    const ProfileCategory: React.FC<ProfileCategoryProps> = ({ fadeIn, userData, setUserData, token, t, ref }) => {
        const [currentTab, setCurrentTab] = useState(0);
        const [isEditing, setIsEditing] = useState(false);
        const [currentSkin, setCurrentSkin] = useState(0);
        const [nicknameInput, setNicknameInput] = useState(userData.nickname);
        const [cardData, setCardData] = useState<CardData[]>([]);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [isInsufficientFundsModalOpen, setIsInsufficientFundsModalOpen] = useState(false); // Для недостатка средств
        const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
        const [errorModalOpen, setErrorModalOpen] = useState(false); // Модальное окно для ошибки
        const [errorMessage, setErrorMessage] = useState("");
        useEffect(() => {
            // Создаем массив карточек и помечаем купленные
            let cardData = [...Array(12)].map((_, index) => ({
                image: <HeroIconPNG />,
                title: `Card Title ${index + 1}`,
                subtitle: '16,000 PTS',
                selected: false,
                purchased: userData.ownedSkins.includes(`Card Title ${index + 1}`),
                selectable: true,
                cost: 16000,
            }));

            const defaultSkin = {
                image: <HeroIconPNG />, // Используем любую иконку или графику для дефолтного скина
                title: t("Default Skin"),
                subtitle: 'This is your default skin',
                selected: false,
                purchased: true, // Дефолтный скин считается купленным
                selectable: true, // Нельзя выбрать, если куплены другие скины
                cost: 0,
            };
            cardData = [defaultSkin, ...cardData];

            // Проверяем, если у пользователя нет скинов или не выбран скин, используем дефолтный
            const hasNoSkins = userData.ownedSkins.includes('[]') || userData.ownedSkins.includes("defaultSkin");

            const selectedSkinTitle = !userData.selectedSkin && hasNoSkins ? t("Default Skin") : userData.selectedSkin;
            const selectedCardIndex = cardData.findIndex((card) => card.title === selectedSkinTitle);

            // Устанавливаем текущий скин
            if (selectedCardIndex !== -1) {
                setCurrentSkin(selectedCardIndex);
            }

            setCardData(cardData);
        }, [userData]);


        const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNicknameInput(e.target.value);
        };

        const handleEditClick = async () => {
            if (isEditing && nicknameInput !== userData.nickname && token) {
                const updatedUserData = { ...userData, nickname: nicknameInput };
                try {
                    const updatedData = await updateUser(updatedUserData, token);
                    if (!updatedData) {
                        throw new Error(t("Failed to update nickname."));
                    } else {
                        setUserData(updatedData);
                    }
                } catch (error: any) {
                    setErrorMessage(error.message || t("An error occurred while updating the nickname."));
                    setErrorModalOpen(true); // Открываем модальное окно с ошибкой
                    setNicknameInput(userData.nickname); // Возвращаем старый ник, если произошла ошибка
                }
            }
            setIsEditing(!isEditing);
        };
        const handleCardClick = (index: number) => {
            const card = cardData[index];

            if (card.purchased) {
                // Всегда обновляем выбор для купленных карточек
                setCurrentSkin(index);  // Устанавливаем выбранную карточку как текущую

                if (token) {
                    updateCacheWithSelection(userData.id, card.title, token);
                }
            } else if (!card.purchased && card.selectable) {
                if (userData.balance >= card.cost) {
                    setSelectedCard(card);
                    setIsModalOpen(true);  // Открываем модальное окно для подтверждения покупки
                } else {
                    setIsInsufficientFundsModalOpen(true);  // Модальное окно недостатка средств
                }
            }
        };

        const handlePurchaseConfirm = async () => {
            if (selectedCard && token) {
                try {
                    // Обновляем пользователя и карточки только после успешного завершения покупки
                    const updatedCards = cardData.map((card) =>
                        card.title === selectedCard.title ? { ...card, purchased: true } : card
                    );

                    // Обновляем данные пользователя на сервере (списание баланса и добавление купленного скина)
                    const updatedUserData = {
                        ...userData,
                        balance: userData.balance - selectedCard.cost,
                        ownedSkins: [...userData.ownedSkins, selectedCard.title],
                        selectedSkin: selectedCard.title,  // Обновляем выбранную карточку на сервере
                    };

                    const updatedData = await updateUser(updatedUserData, token); // Ждем успешного завершения запроса

                    // После успешного завершения запроса:
                    setUserData(updatedData); // Обновляем данные пользователя в приложении
                    setCardData(updatedCards); // Обновляем данные карточек
                    setCurrentSkin(cardData.findIndex(card => card.title === selectedCard.title));  // Устанавливаем купленную карточку как текущую

                    // Обновляем кэш с выбранным скином после успешного запроса
                    await updateCacheWithSelection(userData.id, selectedCard.title, token);

                    setIsModalOpen(false); // Закрываем модальное окно
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        };


        const handleInsufficientFundsModalClose = () => {
            setIsInsufficientFundsModalOpen(false);
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
        };

        const handleErrorModalClose = () => {
            setErrorModalOpen(false);
        };

        return (
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className={styles.profileContainer} ref={ref}>
                <div className={styles.nickInput}>
                    <div className={styles.inputWrapper}>
                        <Input
                            value={nicknameInput}
                            onChange={handleNicknameChange}
                            className={styles.inputWithButton}
                            placeholder={t("Enter your nickname")}
                            disabled={!isEditing}
                        />
                        <Button className={styles.saveButton} onClick={handleEditClick} style={{ borderRadius: '14px' }}>
                            {isEditing ? <CheckIcon /> : <Icon28Edit />}
                        </Button>
                    </div>
                </div>
                <div className={styles.skinContainer}>
                    <Card
                        image={<HeroIconPNG />}
                        title={`Skin ${currentSkin + 1}`}
                        subtitle={t('Current skin')}
                        selectable={false}
                        purchased={true} // Текущий скин всегда куплен
                    />
                    <div className={styles.CellsContainer}>
                        <Cell
                            className={styles.Cell}
                            before={<div><CoinIcon /></div>}
                            subtitle={<div style={{ color: 'green' }}>{userData.balance} pts</div>}
                        >
                            <div className={styles.DailyTaskName}>
                                <p style={{ textOverflow:'ellipsis' }}>Invite friend</p>
                            </div>
                        </Cell>
                        <Cell
                            className={styles.Cell}
                            before={<div><CoinIcon /></div>}
                            subtitle={<div style={{ color: 'green' }}>{userData.balance} pts</div>}
                        >
                            <div className={styles.DailyTaskName}>
                                <p style={{ textOverflow:'ellipsis' }}>Invite friend</p>
                            </div>
                        </Cell>
                        <Cell
                            className={styles.Cell}
                            before={<div><CoinIcon /></div>}
                            subtitle={<div style={{ color: 'green' }}>{userData.balance} pts</div>}
                        >
                            <div className={styles.DailyTaskName}>
                                <p style={{ textOverflow:'ellipsis' }}>Invite friend</p>
                            </div>
                        </Cell>
                    </div>
                </div>
                <div style={{ height: '42px', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <TabsList style={{ width: '90%', height: '100%' }}>
                        <TabsList.Item selected={currentTab === 0} onClick={() => setCurrentTab(0)}>{t('Skins')}</TabsList.Item>
                        <TabsList.Item selected={currentTab === 1} onClick={() => setCurrentTab(1)}>{t('Levels')}</TabsList.Item>
                        <TabsList.Item selected={currentTab === 2} onClick={() => setCurrentTab(2)}>{t('Power-ups')}</TabsList.Item>
                    </TabsList>
                </div>
                {currentTab === 0 && (
                    <div className={styles.cardsContainer}>
                        {cardData.map((card, index) => (
                            <div className={styles.card} key={index}>
                                <Card
                                    image={card.image}
                                    title={card.title}
                                    subtitle={card.subtitle}
                                    selected={currentSkin === index}
                                    selectable={card.selectable}
                                    onClick={() => handleCardClick(index)}
                                    purchased={card.purchased}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    style={{ zIndex: '9999', flexDirection: 'column-reverse' }}
                    open={isModalOpen}
                    onOpenChange={setIsModalOpen}
                    header={<Modal.Header />}
                >
                    <Placeholder
                        header={t("Do you want to purchase this card?")}
                        description={t("This action cannot be undone.")}
                        className={styles.modalText}
                    >
                        <div className={styles.modalButtons}>
                            <Button onClick={handlePurchaseConfirm}>{t("Confirm Purchase")}</Button>
                            <Button onClick={handleModalClose}>{t("Cancel")}</Button>
                        </div>
                    </Placeholder>
                </Modal>

                <Modal
                    style={{ zIndex: '9999', flexDirection: 'column-reverse' }}
                    open={isInsufficientFundsModalOpen}
                    onOpenChange={setIsInsufficientFundsModalOpen}
                    header={<Modal.Header />}
                >
                    <Placeholder
                        header={t("Insufficient funds")}
                        description={t("You do not have enough points to purchase this card.")}
                        className={styles.modalText}
                    >
                        <div className={styles.modalButtons}>
                            <Button onClick={handleInsufficientFundsModalClose}>Close</Button>
                        </div>
                    </Placeholder>
                </Modal>
                <Modal
                    style={{ zIndex: '9999', flexDirection: 'column-reverse' }}
                    open={errorModalOpen}
                    onOpenChange={setErrorModalOpen}
                    header={<Modal.Header />}
                >
                    <Placeholder
                        header={t("Error")}
                        description={errorMessage}
                        className={styles.modalText}
                    >
                        <div className={styles.modalButtons}>
                            <Button onClick={handleErrorModalClose}>{t("Close")}</Button>
                        </div>
                    </Placeholder>
                </Modal>
            </motion.div>
        );
    };

    export default ProfileCategory;
