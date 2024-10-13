'use client';


import HomeComponent from "@/categories/home/home";
import {TonConnectUIProvider} from "@tonconnect/ui-react";

export default function Home() {
    return (
        <TonConnectUIProvider manifestUrl="https://untitled7-three.vercel.app/tonconnect-manifest.json">
            <HomeComponent/>
        </TonConnectUIProvider>
        );
}