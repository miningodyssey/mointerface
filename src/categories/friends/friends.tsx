import React from "react";
import styles from "./friends.module.css";
import {motion} from "framer-motion";
import ListElement from "@/categories/friends/listElement/listElement";

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
                <ul className={styles.advantageList}>
                    <li>
                        Get 5,000 points for every friend invited
                    </li>
                    <li>
                        Earn 10% of your friend’s points
                    </li>
                </ul>
                <p>You have earned <span className={styles.inlineHeading}>0</span> from your friends</p>
                <p><span className={styles.inlineHeading}>0</span> friends invited</p>
            </div>
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
        </motion.div>
    );
};

export default FriendsCategory;