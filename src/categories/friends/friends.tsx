import React, {useState, useEffect} from "react";
import styles from "./friends.module.css";
import {motion} from "framer-motion";
import {Button, Cell, List, TabsList} from "@telegram-apps/telegram-ui";
import ListElement from "@/categories/leaderboard/listElement/listElement";

interface FriendsCategoryProps {
    fadeIn: any;
}

const FriendsCategory: React.FC<FriendsCategoryProps> = ({
                                                                     fadeIn,
                                                                 }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.friendsContainer}>
                <div className={styles.textContainer}>
                    <h1>Complete tasks and earn points!</h1>
                    <p>See where you stand and challenge top runners</p>
                    <p>See where you stand and challenge top runners</p>
                </div>
        </motion.div>
    );
};

export default FriendsCategory;
