import * as React from "react"
const WalletIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={28}
        height={28}
        viewBox='0 0 20 28'
        fill="none"
    >
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M21.888 15.896H17.84a3.446 3.446 0 0 1-3.442-3.44 3.447 3.447 0 0 1 3.442-3.442h4.048a.75.75 0 0 1 0 1.5H17.84a1.945 1.945 0 0 0-1.942 1.942c0 1.069.872 1.94 1.942 1.94h4.048a.75.75 0 0 1 0 1.5Z"
            clipRule="evenodd"
        />
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M18.298 13.144h-.312a.75.75 0 0 1 0-1.5h.312a.75.75 0 0 1 0 1.5Z"
            clipRule="evenodd"
        />
        <mask
            id="a"
            width={28}
            height={28}
            x={0}
            y={0}
            maskUnits="userSpaceOnUse"
            style={{
                maskType: "luminance",
            }}
        >
            <path
                fill="#fff"
                fillRule="evenodd"
                d="M2 3h20.639v19.173H2V3Z"
                clipRule="evenodd"
            />
        </mask>
        <g mask="url(#a)">
            <path
                fill="currentColor"
                fillRule="evenodd"
                d="M7.998 4.5A4.503 4.503 0 0 0 3.5 8.998v7.177a4.503 4.503 0 0 0 4.498 4.498h8.644a4.503 4.503 0 0 0 4.497-4.498V8.998A4.503 4.503 0 0 0 16.642 4.5H7.998Zm8.644 17.673H7.998A6.005 6.005 0 0 1 2 16.175V8.998A6.005 6.005 0 0 1 7.998 3h8.644a6.004 6.004 0 0 1 5.997 5.998v7.177a6.004 6.004 0 0 1-5.997 5.998Z"
                clipRule="evenodd"
            />
        </g>
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12.684 9.038H7.285a.75.75 0 0 1 0-1.5h5.4a.75.75 0 0 1 0 1.5Z"
            clipRule="evenodd"
        />
    </svg>
)
export default WalletIcon
