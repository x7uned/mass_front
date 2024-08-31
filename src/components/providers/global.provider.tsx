'use client'

import store from '@/redux/store'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Roboto_Condensed } from 'next/font/google'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Header from '../layouts/header/header'

const roboto = Roboto_Condensed({
	subsets: ['latin'],
	weight: ['400', '500', '600'],
})

const GlobalProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<ThemeProvider attribute='class'>
			<SessionProvider>
				<Provider store={store}>
					<Header />
					<main className={`ml-16 ${roboto.className}`}>{children}</main>
				</Provider>
			</SessionProvider>
		</ThemeProvider>
	)
}

export default GlobalProvider
