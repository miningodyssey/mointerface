import React, {useState, useEffect} from "react";
import styles from "./leaderboard.module.css";
import {motion} from "framer-motion";
import {Button, Cell, List, TabsList} from "@telegram-apps/telegram-ui";
import ListElement from "@/categories/leaderboard/listElement/listElement";
import CopyIcon from "@/components/Icons/CopyIcon/CopyIcon";
import Header from "@/categories/leaderboard/header/header";


type TopPlayersType = {
    userPosition: number
    topTen: any[];
};
interface LeaderBoardCategoryProps {
    fadeIn: any;
    copyLinkToClipboard: any;
    sendLink: any;
    t: any;
    userId: any;
    topPlayers: TopPlayersType;
    friends: any[];
}

const LeaderBoardCategory: React.FC<LeaderBoardCategoryProps> = ({
                                                                     fadeIn,
                                                                     copyLinkToClipboard,
                                                                     sendLink,
                                                                     t,
                                                                     userId,
                                                                     topPlayers,
                                                                     friends

                                                                 }) => {
    const [currentTab, setCurrentTab] = useState(0);
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.leaderBoardContainer}>
            <div>
                <div className={styles.textContainer}>
                    <h2>Become the best runner!</h2>
                    <p>See where you stand and challenge top runners</p>
                </div>
            </div>
            <div style={{height: '42px', width: '100%', display: 'flex', justifyContent:'center', marginBottom: '10px'}}>
                <TabsList style={{width: '90%', height: '100%'}}>
                    <TabsList.Item selected={currentTab === 0} onClick={() => setCurrentTab(0)}>
                        Friends
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 1} onClick={() => setCurrentTab(1)}>
                        Global
                    </TabsList.Item>
                </TabsList>
            </div>
            {
                currentTab === 0 && (
                    <div className={styles.leaderBoardList}>
                        <Header left={`${friends?.length} racers`} right={'Total points'}></Header>
                        {(friends.length > 0) && friends && friends?.map((player, index) => (
                            <ListElement
                                key={index}
                                name={player.nickname || player.id} // используйте ID, если ника нет
                                points={Number(player.balance)}
                                position={index + 1} // позиция игрока, если это нужно
                            />
                        ))}
                    </div>
                )
            }
            {
                currentTab === 1 && (
                    <div className={styles.leaderBoardList}>
                        <Header left={`${topPlayers?.topTen.length} racers`} right={'Total points'}></Header>
                        {topPlayers && topPlayers?.topTen.map((player, index) => (
                            <ListElement
                                key={index}
                                name={player.nickname || player.id} // используйте ID, если ника нет
                                points={player.balance}
                                position={index + 1} // позиция игрока, если это нужно
                            />
                        ))}
                    </div>
                )
            }
            {
                currentTab === 0 && (
                    <div className={styles.inviteButton}>
                        <Button
                            mode='filled'
                            size='l'
                            onClick={() => sendLink(Number(userId))}
                            stretched
                        >
                            {t('inviteFriends' as any)}
                        </Button>
                        <button
                            className={styles.copyButton}
                            onClick={() => copyLinkToClipboard(Number(userId))}
                        >
                            <CopyIcon />
                        </button>
                    </div>
                )
            }
        </motion.div>
    );
};

export default LeaderBoardCategory;
