import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Career Guidance Platform',
  description: 'AI-powered career guidance and skill assessment platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  )
}