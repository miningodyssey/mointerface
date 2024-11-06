'use client';


import HomeComponent from "@/categories/home/home";
import {TonConnectUIProvider} from "@tonconnect/ui-react";

export default function Home() {

    return (
        <TonConnectUIProvider manifestUrl="https://game.miningodyssey.pw/tonconnect-manifest.json">
            <HomeComponent/>
        </TonConnectUIProvider>
        );
}