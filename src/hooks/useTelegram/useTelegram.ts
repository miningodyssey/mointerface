import { useContext } from 'react'
import {TelegramContext} from "@/app/providers/TelegramProvider";

export const useTelegram = () => useContext(TelegramContext)
