import React from "react";
import styles from "./friends.module.css";
import {motion} from "framer-motion";
import ListElement from "@/categories/friends/listElement/listElement";
import {Button} from "@telegram-apps/telegram-ui";
import CopyIcon from "@/components/Icons/CopyIcon/CopyIcon";
import InvitedModal from "@/components/menus/InvitedModal/invitedModal";
import Header from "@/categories/leaderboard/header/header";

interface FriendsCategoryProps {
    fadeIn: any;
    copyLinkToClipboard: any;
    sendLink: any;
    t: any;
    userId: any;
    referals: any;
}

const FriendsCategory: React.FC<FriendsCategoryProps> = ({
                                                             fadeIn,
                                                             copyLinkToClipboard,
                                                             sendLink,
                                                             t,
                                                             userId,
                                                             referals
                                                         }) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.friendsContainer}>
            <div className={styles.textContainer}>
                <h1>{t("Complete tasks and earn points!")}</h1>
                <ul className={styles.advantageList}>
                    <li>
                        {t("Get 5,000 points for every friend invited")}
                    </li>
                    <li>
                        {t("Earn 10% of your friend's points")}
                    </li>
                </ul>
                <p>
                    {t("You have earned")}
                    <span
                        className={styles.inlineHeading}>{referals.reduce((sum: number, referal: any) => sum + Number(referal.earnedByReferer), 0)}
                    </span>
                    {t("from your friends")}
                </p>
                <p><span className={styles.inlineHeading}>{referals.length}</span> {t("friends invited")}</p>
            </div>
            <div className={styles.leaderBoardList}>
                <Header left={`${referals?.length} ${t('racers')}`} right={t('Total points')}></Header>
                {referals && (referals.length > 0) && referals?.map((player: any, index: number) => (
                    <ListElement
                        key={index}
                        name={player.nickname || player.id} // используйте ID, если ника нет
                        points={player.earnedByReferer}
                        position={index + 1} // позиция игрока, если это нужно
                    />
                ))}
            </div>
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
                    <CopyIcon/>
                </button>
            </div>

        </motion.div>
    );
};

export default FriendsCategory;
