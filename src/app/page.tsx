'use client';


import HomeComponent from "@/categories/home/home";
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import {TonClientProvider} from "@/context/ton-client-context";


export default function Home() {

    return (
        <TonConnectUIProvider manifestUrl="https://game.miningodyssey.pw/tonconnect-manifest.json">
            <TonClientProvider>
                <HomeComponent></HomeComponent>
            </TonClientProvider>
        </TonConnectUIProvider>
        );
}