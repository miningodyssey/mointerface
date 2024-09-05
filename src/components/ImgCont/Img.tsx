import React, { HTMLAttributes, useEffect, useState } from 'react';
import './ImgStyles.css';
import NextImage from "next/image";

interface IProgressiveImageProps extends HTMLAttributes<HTMLDivElement> {
    src?: string;
    width?: number;
    height?: number;
    alt: string;
    children?: React.ReactNode;  // Add children prop
}

export const ProgressiveImageCont: React.FC<IProgressiveImageProps> = (props) => {
    const [loaded, setLoaded] = useState(false);

    const {
        src,
        width,
        height,
        alt,
        className,
        children  // Destructure children
    } = props;

    useEffect(() => {
        if (!src) {
            return;
        }

        const image = new globalThis.Image();  // Use globalThis.Image

        image.onload = () => {
            setLoaded(true);
        };
        image.src = src;
    }, [src]);

    if (!src) {
        return (
            <div className={'Placeholder'} />
        );
    }

    return (
        <div className={`${className} progressiveImageContainer`} style={{ width, height }}>
            {!loaded && <div className={`Placeholder ${className}`} />}
            {loaded && (
                <NextImage
                    priority={true}
                    className="progressiveImage"
                    src={src}
                    width={width || 0}  // Provide default value
                    height={height || 0} // Provide default value
                    alt={alt}
                />
            )}
            {children && <div className="progressiveImageContent">{children}</div>}
        </div>
    );
};
