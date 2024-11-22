import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from "./profile.module.css";
import {motion} from "framer-motion";
import Card from "@/categories/profile/Card/card";
import {Cell, Input, TabsList, Button, Placeholder, Modal} from "@telegram-apps/telegram-ui";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import HeroIconPNG from "@/components/Icons/heroIcon/heroIconPNG";
import CheckIcon from "@/components/Icons/CheckIcon/checkIcon";
import {Icon28Edit} from "@telegram-apps/telegram-ui/dist/icons/28/edit";
import {updateUser} from "@/components/functions/updateUser";
import {updateCacheWithSelection} from "@/components/functions/updateCacheWithSelection";
import {useTonConnectModal} from "@tonconnect/ui-react";
import {JettonMaster, toNano} from "ton";
import {JettonWallet} from "@/wrappers/JettonWallet";
import {Address} from "@ton/core";
import {useGenerateId} from "@/hooks/useGenerateId";

interface ProfileCategoryProps {
    fadeIn: any;
    userData: any;
    setUserData: (data: any) => void;
    token?: string;
    t: any;
    tonClient: any;
    walletAddress: any;
    ref: any;
    sender: any;
}

interface CardData {
    id: string
    image: React.JSX.Element;
    title: string;
    subtitle: string;
    selected: boolean;
    purchased: boolean;
    selectable: boolean;
    cost: number;
}

const ProfileCategory: React.FC<ProfileCategoryProps> = ({fadeIn, userData, setUserData, token, t, ref, tonClient, walletAddress, sender}) => {

    const defaultWagon = "defaultWagon";
    const defaultSkin = "defaultSkin";
    const defaultRoad = "defaultRoad";
    const defaultJumpObstacle = "defaultJumpObstacle";
    const defaultSlideObstacle = "defaultSlideObstacle";

    const [currentTab, setCurrentTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSkin, setSelectedSkin] = useState(userData.selectedSkin);
    const [selectedWagon, setSelectedWagon] = useState(userData.selectedWagon);
    const [selectedRoad, setSelectedRoad] = useState(userData.selectedRoad);
    const [selectedJumpObstacle, setSelectedJumpObstacle] = useState(userData.selectedJumpObstacle);
    const [selectedSlideObstacle, setSelectedSlideObstacle] = useState(userData.selectedSlideObstacle);
    const [nicknameInput, setNicknameInput] = useState(userData.nickname);
    const [cardData, setCardData] = useState<CardData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const orderId = useGenerateId();
    const { open } = useTonConnectModal();
    const [isInsufficientFundsModalOpen, setIsInsufficientFundsModalOpen] = useState(false); // Для недостатка средств
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false); // Модальное окно для ошибки
    const [errorMessage, setErrorMessage] = useState("");


    const categories = [
        {
            name: t("Skins"),
            tag: 'Skins',
            items: [
                { id: "defaultSkin", title: t("Default Skin"), cost: 0, purchased: true },
                { id: "blackSkin", title: "Black", cost: 5000, purchased: userData.ownedSkins?.includes("blackSkin") },
                { id: "blueSkin", title: "Blue", cost: 5000, purchased: userData.ownedSkins?.includes("blueSkin") },
                { id: "telegramSkin", title: "Telegram", cost: 10000, purchased: userData.ownedSkins?.includes("telegramSkin") },
                { id: "pinkSkin", title: "Pink", cost: 10000, purchased: userData.ownedSkins?.includes("pinkSkin") },
            ],
            selected: selectedSkin || "defaultSkin",
            setSelected: (id: string) => {
                setSelectedSkin(id);
                setUserData({ ...userData, selectedSkin: id });
            },
        },
        {
            name: t("Wagons"),
            tag: 'Wagons',
            items: [
                { id: "defaultWagon", title: t("Default Wagon"), cost: 0, purchased: true },
                { id: "orangeWagon", title: t("Orange"), cost: 5000, purchased: userData.ownedWagons?.includes("orangeWagon") },
            ],
            selected: selectedWagon || "defaultWagon",
            setSelected: (id: string) => setSelectedWagon(id),
        },
        {
            name: t("Roads"),
            tag: 'Roads',
            items: [
                { id: "defaultRoad", title: t("Default Road"), cost: 0, purchased: true },
                { id: "forestRoad", title: t("Forest"), cost: 5000, purchased: userData.ownedRoads?.includes("forestRoad") },
            ],
            selected: selectedRoad || "defaultRoad",
            setSelected: (id: string) => setSelectedRoad(id),
        },
        {
            name: t("Jump Obstacles"),
            tag: 'JumpObstacles',
            items: [
                { id: "defaultJumpObstacle", title: t("Default"), cost: 0, purchased: true },
            ],
            selected: selectedJumpObstacle || "defaultJumpObstacle",
            setSelected: (id: string) => setSelectedJumpObstacle(id),
        },
        {
            name: t("Slide Obstacles"),
            tag: 'SlideObstacles',
            items: [
                { id: "defaultSlideObstacle", title: t("Default"), cost: 0, purchased: true },
            ],
            selected: selectedSlideObstacle || "defaultSlideObstacle",
            setSelected: (id: string) => setSelectedSlideObstacle(id),
        },
    ];

    useEffect(() => {
        const initializedUserData = {
            ...userData,
            ownedSkins: userData.ownedSkins ?? [defaultSkin],
            ownedWagons: userData.ownedWagons ?? [defaultWagon],
            ownedRoads: userData.ownedRoads ?? [defaultRoad],
            ownedJumpObstacles: userData.ownedJumpObstacles ?? [defaultJumpObstacle],
            ownedSlideObstacles: userData.ownedSlideObstacles ?? [defaultSlideObstacle],
        };

        // Только если были изменения
        if (
            !userData.ownedSkins ||
            !userData.ownedWagons ||
            !userData.ownedRoads ||
            !userData.ownedJumpObstacles ||
            !userData.ownedSlideObstacles
        ) {
            setUserData(initializedUserData);
        }
    }, [userData, setUserData]);

    useEffect(() => {
        const currentCategory = categories[currentTab];

        setCardData(
            currentCategory.items.map((item) => ({
                id: item.id, // Добавляем id в данные карточек
                image: <HeroIconPNG />,
                title: item.title,
                subtitle: item.purchased ? t("Purchased") : `${item.cost} PTS`,
                selected: currentCategory.selected === item.id, // Сравниваем по id
                purchased: item.purchased,
                selectable: true,
                cost: item.cost,
            }))
        );
    }, [currentTab, userData]);
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNicknameInput(e.target.value);
    };

    const handleEditClick = async () => {
        if (isEditing && nicknameInput !== userData.nickname && token) {
            const updatedUserData = {...userData, nickname: nicknameInput};
            try {
                const updatedData = await updateUser(updatedUserData);
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
        const currentCategory = categories[currentTab];

        if (card.purchased) {
            // Обновляем выбранную карточку в текущей категории
            currentCategory.setSelected(currentCategory.items[index].id);

            // Создаем объект с текущими значениями
            let updatedSelection = {
                selectedSkin: selectedSkin,
                selectedWagon: selectedWagon,
                selectedRoad: selectedRoad,
                selectedSlideObstacle: selectedSlideObstacle,
                selectedJumpObstacle: selectedJumpObstacle,
            };

            // Динамически определяем ключ для обновления
            const selectionCategory = `selected${currentCategory.tag.slice(0, -1)}` as keyof typeof updatedSelection;

            // Обновляем нужное поле
            updatedSelection[selectionCategory] = card.id;
            let updatedUserData = {...userData, ...updatedSelection}
            setUserData(updatedUserData)
            // Отправляем обновленный объект на сервер
            updateCacheWithSelection(userData.id, updatedSelection, token);
        } else if (!card.purchased && userData.balance >= card.cost) {
            setSelectedCard(card);
            setIsModalOpen(true);
        } else {
            setIsInsufficientFundsModalOpen(true);
        }
    };


    const handlePurchaseConfirm = async () => {
        if (!selectedCard) return;

        try {
            if (!tonClient) {
                console.error("TON Client is not initialized");
                return;
            }
            if (!walletAddress) {
                console.error("Wallet address is missing");
                return;
            }

            console.log("Creating Jetton Master...");
            const jettonMaster = tonClient.open(
                JettonMaster.create(Address.parse("EQAE95N7Kj2SJ5r2aP9q9goPMpmV08O2phPIOxVIsRRI6c_6"))
            );
            console.log("Jetton Master created successfully");

            console.log("Getting user's USDT address...");
            const usersUsdtAddress = await jettonMaster.getWalletAddress(walletAddress);
            console.log("User USDT Address:", usersUsdtAddress.toString());

            const jettonWallet = tonClient.open(
                JettonWallet.createFromAddress(usersUsdtAddress)
            );
            console.log("Jetton Wallet created successfully:", jettonWallet);

            console.log("Sending transfer...");
            await jettonWallet.sendTransfer(sender, {
                fwdAmount: BigInt(1),
                comment: orderId,
                jettonAmount: BigInt(selectedCard.cost * 1e9),
                toAddress: Address.parse('EQAE95N7Kj2SJ5r2aP9q9goPMpmV08O2phPIOxVIsRRI6c_6'),
                value: toNano('0.038'),
            });

            console.log("Transfer sent successfully");

            const updatedUserData = {
                ...userData,
                balance: userData.balance - selectedCard.cost,
                [`owned${categories[currentTab].tag}`]: [...userData[`owned${categories[currentTab].tag}`], selectedCard.id],
                [`selected${categories[currentTab].tag.slice(0, -1)}`]: selectedCard.id,
            };

            const updatedData = await updateUser(updatedUserData);
            setUserData(updatedData);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error during payment process:", error);
            setErrorMessage(t("Payment failed"));
            setErrorModalOpen(true);
        }
    };



    const handleConnectWallet = useCallback(() => {
        open();
    }, [open]);

    const handleInsufficientFundsModalClose = useCallback(() => {
        setIsInsufficientFundsModalOpen(false);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleErrorModalClose = useCallback(() => {
        setErrorModalOpen(false);
    }, []);


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
                    <Button className={styles.saveButton} onClick={handleEditClick} style={{borderRadius: '14px'}}>
                        {isEditing ? <CheckIcon/> : <Icon28Edit/>}
                    </Button>
                </div>
            </div>
            <div className={styles.skinContainer}>
                <Card
                    image={<HeroIconPNG/>}
                    title={`Skin ${selectedSkin}`}
                    subtitle={t('Current skin')}
                    selectable={false}
                    purchased={true} // Текущий скин всегда куплен
                />
                <div className={styles.CellsContainer}>
                    <Cell
                        className={styles.Cell}
                        before={<div><CoinIcon/></div>}
                        subtitle={<div style={{color: 'green'}}>{userData.balance} pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p style={{textOverflow: 'ellipsis'}}>Invite friend</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={<div><CoinIcon/></div>}
                        subtitle={<div style={{color: 'green'}}>{userData.balance} pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p style={{textOverflow: 'ellipsis'}}>Invite friend</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={<div><CoinIcon/></div>}
                        subtitle={<div style={{color: 'green'}}>{userData.balance} pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p style={{textOverflow: 'ellipsis'}}>Invite friend</p>
                        </div>
                    </Cell>
                </div>
            </div>
            <div style={{
                height: '42px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
            }}>
                <TabsList>
                    {categories.map((cat, index) => (
                        <TabsList.Item
                            key={index}
                            selected={currentTab === index}
                            onClick={() => setCurrentTab(index)}
                        >
                            {cat.name}
                        </TabsList.Item>
                    ))}
                </TabsList>
            </div>
            <div className={styles.cardsContainer}>
                {categories[currentTab].items.map((item, index) => (
                    <Card
                        key={index}
                        image={<HeroIconPNG/>}
                        title={item.title}
                        subtitle={item.purchased ? t("Purchased") : `${item.cost} PTS`}
                        selected={categories[currentTab].selected === item.id}
                        onClick={() => handleCardClick(index)}
                        purchased={item.purchased}
                        selectable={true}
                    />
                ))}
            </div>

            <Modal
                style={{zIndex: '9999', flexDirection: 'column-reverse'}}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                header={<Modal.Header/>}
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
                style={{zIndex: '9999', flexDirection: 'column-reverse'}}
                open={isInsufficientFundsModalOpen}
                onOpenChange={setIsInsufficientFundsModalOpen}
                header={<Modal.Header/>}
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
                style={{zIndex: '9999', flexDirection: 'column-reverse'}}
                open={errorModalOpen}
                onOpenChange={setErrorModalOpen}
                header={<Modal.Header/>}
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
