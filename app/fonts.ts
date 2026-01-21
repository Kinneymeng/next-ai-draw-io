import localFont from "next/font/local"

export const plusJakarta = localFont({
    src: "./fonts/PlusJakartaSans-VariableFont_wght.ttf",
    variable: "--font-sans",
    weight: "400 700",
    display: "swap",
})

export const jetbrainsMono = localFont({
    src: "./fonts/JetBrainsMono-VariableFont_wght.ttf",
    variable: "--font-mono",
    weight: "400 500",
    display: "swap",
})
