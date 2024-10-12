import React, {useState} from "react";
import styles from "./profile.module.css";
import {motion} from "framer-motion";
import Card from "@/categories/profile/Card/card";
import {Cell, Input, TabsList} from "@telegram-apps/telegram-ui";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";
import HeroIcon from "@/components/Icons/heroIcon/heroIcon";
import HeroIconPNG from "@/components/Icons/heroIcon/heroIconPNG";

interface ProfileCategoryProps {
    fadeIn: any;
    copyLinkToClipboard: any;
    sendLink: any;
    t: any;
    userId: any
}

const ProfileCategory: React.FC<ProfileCategoryProps> = ({
                                                             fadeIn,
                                                             copyLinkToClipboard,
                                                             sendLink,
                                                             t,
                                                             userId
                                                         }) => {
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.profileContainer}>
            <div className={styles.nickInput}>
                <Input/>
            </div>
            <div className={styles.skinContainer}>
                <Card image={<HeroIconPNG/>} title={'Selected'} subtitle={'Hero'}></Card>
                <div className={styles.CellsContainer}>
                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <CoinIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <LightningIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>

                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <CoinIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>
                </div>
            </div>
            <div style={{height: '42px', width: '100%', display: 'flex', justifyContent: 'center'}}>
                <TabsList style={{width: '90%', height: '100%'}}>
                    <TabsList.Item selected={currentTab === 0} onClick={() => setCurrentTab(0)}>
                        Friends
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 1} onClick={() => setCurrentTab(1)}>
                        Global
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 2} onClick={() => setCurrentTab(2)}>
                        Global
                    </TabsList.Item>
                </TabsList>
            </div>

        </motion.div>
    );
};

export default ProfileCategory;
