import './globals.css'

export const metadata = {
  title: 'Clinic Reservation',
  description: 'Quick clinic bookings — no login required'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto p-6">
          {children}
        </div>
      </body>
    </html>
  )
}
