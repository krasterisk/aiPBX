import { type SVGProps } from 'react'

interface Bitrix24IconProps extends SVGProps<SVGSVGElement> {
    size?: number
}

export const Bitrix24Icon = ({ size = 24, ...props }: Bitrix24IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <circle cx="12" cy="12" r="12" fill="#2FC7F7" />
        <text
            x="12"
            y="12"
            dominantBaseline="central"
            textAnchor="middle"
            fill="white"
            fontFamily="Inter, system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="11"
        >
            {/* eslint-disable-next-line i18next/no-literal-string */}
            24
        </text>
    </svg>
)
