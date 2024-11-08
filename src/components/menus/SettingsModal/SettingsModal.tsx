import React, {ChangeEvent, useState} from 'react';
import styles from './SettingsModal.module.css';
import {Slider, Switch} from "@telegram-apps/telegram-ui";
import {TouchEvent} from "@telegram-apps/telegram-ui/dist/components/Service/Touch/Touch";
import {useTranslation} from "react-i18next"; // Подключаем стили из CSS-модуля


interface Settings {
    graphicsQuality: number;
    antiAliasingEnabled: boolean;
    textureResolution: number;
}

interface SettingsModalProps {
    settings: any;
    onSettingsChange: (settings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSettingsChange }) => {
    const [graphicsQuality, setGraphicsQuality] = useState<any>(settings.graphicsQuality);
    const [antiAliasingEnabled, setAntiAliasingEnabled] = useState<any>(settings.antiAliasingEnabled);
    const [textureResolution, setTextureResolution] = useState<any>(settings.textureResolution);
    const {t} = useTranslation();
    const handleGraphicsQualityChange = (value: number, event: TouchEvent | ChangeEvent) => {
        setGraphicsQuality(value);
    };

    const handleAntiAliasingChange = (e: any) => {
        setAntiAliasingEnabled(e.target.checked);
    };

    const handleTextureResolutionChange = (value: number, event: TouchEvent | ChangeEvent) => {
        setTextureResolution(value);
    };
    const saveSettings = () => {
        onSettingsChange({ graphicsQuality, antiAliasingEnabled, textureResolution });
    }
    return (
        <div className={`${styles.modal}`}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 style={{margin: '0'}}>{t('Game Settings' as any)}</h2>
                    <span className={styles.closeBtn} onClick={saveSettings}>&times;</span>
                </div>

                <div className={styles.modalItem}>
                    <label>{t('Graphics Quality' as any)}</label>
                    <Slider
                        defaultValue={settings.graphicsQuality}
                        style={{ width: '100%' }}
                        min={1}
                        max={100}
                        value={graphicsQuality}
                        onChange={(value: number, event: TouchEvent | ChangeEvent) => handleGraphicsQualityChange(value, event)}
                        multiple={false}
                    />
                </div>

                <div className={styles.modalItem} style={{paddingRight: "24px"}}>
                    <label>{t('Anti-Aliasing' as any)}</label>
                        <Switch
                            defaultChecked={settings.antiAliasingEnabled}
                            checked={antiAliasingEnabled}
                            onChange={handleAntiAliasingChange}
                        />
                </div>

                <div className={styles.modalItem}>
                    <label>{t('Texture Resolution' as any)}</label>
                    <Slider
                        defaultValue={settings.textureResolution}
                        style={{ width: '100%' }}
                        min={1}
                        max={100}
                        value={textureResolution}
                        onChange={(value: number, event: TouchEvent | ChangeEvent) => handleTextureResolutionChange(value, event)}
                        multiple={false}
                    />
                </div>
            </div>
        </div>
    );
}
