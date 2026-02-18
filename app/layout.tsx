import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SALU División Veterinaria — Productos y Medicamentos Veterinarios Premium',
  description: 'SALU División Veterinaria provee productos farmacéuticos certificados, biológicos y consumibles veterinarios a clínicas, hospitales y distribuidores en toda América Latina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
