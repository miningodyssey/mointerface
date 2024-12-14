import React from 'react';

interface HeroIconPNGProps {
    imagePath: string;
    altText?: string; // Дополнительно: для гибкости можно задать текст для атрибута alt
}

const HeroIconPNG: React.FC<HeroIconPNGProps> = ({ imagePath, altText = "Image" }) => {
    return (
        <img src={imagePath} alt={altText} />
    );
};

export default HeroIconPNG;
