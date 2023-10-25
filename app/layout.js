import './globals.scss'

export const metadata = {
    title: 'Customizable Color Picker',
    description: 'A user-friendly Next.js application that allows you to pick colors seamlessly. With the added feature of saving custom colors, our color picker ensures your favorite shades are always just a click away',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
