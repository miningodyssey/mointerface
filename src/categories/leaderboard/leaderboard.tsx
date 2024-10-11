import React, {useState, useEffect} from "react";
import styles from "./leaderboard.module.css";
import {motion} from "framer-motion";
import {Button, Cell, List, TabsList} from "@telegram-apps/telegram-ui";
import ListElement from "@/categories/leaderboard/listElement/listElement";

interface LeaderBoardCategoryProps {
    fadeIn: any;
}

const LeaderBoardCategory: React.FC<LeaderBoardCategoryProps> = ({
                                                                     fadeIn,
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
            <div style={{height: '42px', width: '100%', display: 'flex', justifyContent:'center'}}>
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
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                        <ListElement name={'Bebrikh'} points={5000} position={1}/>
                    </div>
                )
            }
            {
                currentTab === 1 && (
                    <div className={styles.leaderBoardList}>
                    </div>
                )
            }
        </motion.div>
    );
};

export default LeaderBoardCategory;
