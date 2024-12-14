'use client';


import HomeComponent from "@/categories/home/home";
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import {TonClientProvider} from "@/context/ton-client-context";
import GameComponent from "@/game/components/GameComponent";
import {useState} from "react";
import {useTranslation} from "react-i18next";


export default function Home() {
    return (
        <TonConnectUIProvider manifestUrl="https://untitled7-three.vercel.app/tonconnect-manifest.json">
            <TonClientProvider>
                <HomeComponent></HomeComponent>
            </TonClientProvider>
        </TonConnectUIProvider>
    );
}