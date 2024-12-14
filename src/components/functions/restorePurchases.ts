import crypto from "crypto";
import {Address} from "@ton/core";
import {updateUser} from "@/components/functions/updateUser";

interface RestoredItems {
    ownedSkins: string[],
    ownedWagons: string[],
    ownedRoads: string[],
    ownedJumpObstacles: string[],
    ownedSlideObstacles: string[],
}

interface ParsedComment {
    cardId: string;
    cost: number;
    wallet: string;
    userid: string;
}

function decryptComment(encryptedData: string, key: Buffer): string {
    try {
        const [ivHex, encryptedText] = encryptedData.split(":");
        if (!ivHex || !encryptedText) {
            throw new Error("Invalid encrypted data format");
        }
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        return "skip";
    }
}

const decodeHexToString = (hex: string): string => {
    try {
        const cleanHex = hex.replace(/^0+/, ''); // Убираем ведущие нули
        const asciiString = cleanHex.match(/.{2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        return asciiString || '';
    } catch (error) {
        console.error("Failed to decode hex string:", error);
        return ''; // Возвращаем пустую строку при ошибке
    }
};


const processHexBlocks = (input: string): string[] => {
    try {
        // Ищем блоки формата x{...}
        const blocks = input.match(/x\{[0-9A-Fa-f]+\}/g) || [];
        const sortedBlocks = blocks
            .map(block => block.slice(2, -1)) // Убираем 'x{' и '}'
            .map(decodeHexToString) // Декодируем каждую строку
        return sortedBlocks
    } catch (error) {
        console.error("Failed to process hex blocks:", error);
        return [];
    }
};

function joinEncryptedParts(array: string[]): string {
    const regex = /^[a-fA-F0-9]+:[a-fA-F0-9]+$/;

    let foundIndex = -1;

    // Найти индекс первого элемента, который удовлетворяет условию
    for (let i = 0; i < array.length; i++) {
        if (regex.test(array[i])) {
            foundIndex = i;
            break;
        }
    }

    // Если ничего не найдено, вернуть массив как есть
    if (foundIndex === -1) {
        return '';
    }

    // Объединяем все элементы начиная с найденного
    // Возвращаем массив с неизменённой начальной частью и сконкатенированной строкой
    return array.slice(foundIndex).join('');
}



const getCommentsFromTransactions = async (address: Address, key: Buffer, tonClient: any) => {
    try {
        if (!tonClient) {
            console.error("TON Client is not initialized");
            return;
        }
        if (!address) {
            console.error("Wallet address is missing");
            return;
        }
        const transactions = await tonClient.getTransactions(address, { limit: 100 });
        let result: string[] = []
        transactions.forEach((transaction: any) => {
            if (transaction.inMessage && transaction.inMessage.body) {
                const slice = transaction.inMessage.body.toString();
                const comments = processHexBlocks(slice);
                const comment = joinEncryptedParts(comments);
                const decryptedComment = decryptComment(comment, key)
                if (decryptedComment !== 'skip') {
                    result.push(decryptedComment);
                }
            }
        });
        return result
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
};


export const restorePurchases = async (userid: any, address: Address, key: Buffer, tonClient: any, userData: any, setUserData: any) => {
    const comments = await getCommentsFromTransactions(address, key, tonClient)

    const restoredItems: RestoredItems = {
        ownedSkins: [],
        ownedWagons: [],
        ownedRoads: [],
        ownedJumpObstacles: [],
        ownedSlideObstacles: [],
    };

    const currentUserId = userid;
    if (comments !== undefined && comments.length !== 0) {
        comments.forEach((comment) => {
            try {
                const parsedComment: ParsedComment = JSON.parse(comment);
                if ((parsedComment.userid !== currentUserId) || (parsedComment.userid === undefined)) {
                    return;
                }

                const {cardId} = parsedComment;

                if (cardId.includes("Skin")) {
                    restoredItems.ownedSkins.push(cardId);
                } else if (cardId.includes("Wagon")) {
                    restoredItems.ownedWagons.push(cardId);
                } else if (cardId.includes("Road")) {
                    restoredItems.ownedRoads.push(cardId);
                } else if (cardId.includes("JumpObstacle")) {
                    restoredItems.ownedJumpObstacles.push(cardId);
                } else if (cardId.includes("SlideObstacle")) {
                    restoredItems.ownedSlideObstacles.push(cardId);
                }
            } catch (error) {
                console.error("Ошибка при обработке комментария:", comment, error);
            }
        });

        // Обновление данных пользователя, если были восстановлены покупки
        if (Object.values(restoredItems).some((items) => items.length > 0)) {
            const updatedUserData = {
                ...userData,
                ...Object.keys(restoredItems).reduce((acc, key) => {
                    // Указываем, что key будет ключом типа RestoredItems
                    const itemKey = key as keyof RestoredItems;
                    return {
                        ...acc,
                        [itemKey]: Array.from(new Set([...(userData[itemKey] || []), ...restoredItems[itemKey]])), // Уникальные элементы
                    };
                }, {}),
            };

            setUserData(updatedUserData);
            updateUser(updatedUserData);
        }
    }
};
