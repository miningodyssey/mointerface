import React, {HTMLAttributes, useEffect, useState} from 'react'
import './ImgStyles.css'
import NextImage from "next/image";


interface IProgressiveImageProps extends HTMLAttributes<HTMLImageElement>{
    src?: string;
    width?: string;
    height?: string;
    alt: string;
}

export const ProgressiveImage: React.FC<IProgressiveImageProps> = (props) => {
    const [loaded, setLoaded] = useState(false);

    const {
        src,
        width,
        height,
        alt,
        className
    } = props;

    useEffect(() => {
        if (!src) {
            return
        }

        const image = new Image();

        image.onload = () => {
            setLoaded(true);
        }
        image.src = src;
    }, [src]);

    if (!src) {
        return (
            <div className={'Placeholder'}
            />
        );
    }

    return (
        <div className={className}>
            {!loaded && <div className={`Placeholder, ${className}`}
                             style={{width,height}}
            />}
            {loaded && <NextImage
                className={className}
                src={src}
                width={Number(width)}
                height={Number(height)}
                alt={alt}
            />
            }
        </div>
    )
}