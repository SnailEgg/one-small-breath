import { Courier_Prime } from 'next/font/google'
import { Merriweather_Sans } from 'next/font/google'
import '@/app/globals.css'

const merriweather_sans = Merriweather_Sans({subsets: ["latin"]});
const courier_prime = Courier_Prime({ subsets: ['latin'], weight: ['400'] })

export const metadata = {
  title: 'One Small Breath',
  description: 'A game by Jordan Delta Smith',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={courier_prime.className}>
        {children}
      </body>
    </html>
  )
}
