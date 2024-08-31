'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { BsMoonStars, BsSunFill } from 'react-icons/bs'
import { MdDisplaySettings } from 'react-icons/md'

interface ThemeChangeComponentProps {
	menu: boolean
}

const CurrentTheme = ({ theme }: { theme: string | undefined }) => {
	switch (theme) {
		case 'light':
			return (
				<div className='flex w-8 h-8 items-center justify-center bg-[var(--second)]'>
					<BsSunFill size='16px' />
				</div>
			)
		case 'dark':
			return (
				<div className='flex w-8 h-8 items-center justify-center bg-[var(--second)]'>
					<BsMoonStars size='16px' />
				</div>
			)
		case 'system':
			return (
				<div className='flex w-8 h-8 items-center justify-center bg-[var(--second)]'>
					<MdDisplaySettings size='16px' />
				</div>
			)
		default:
			return null
	}
}

const ThemeChangeComponent = ({ menu }: ThemeChangeComponentProps) => {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// Устанавливаем mounted в true только после того, как компонент будет монтирован
	useEffect(() => {
		setMounted(true)
	}, [])

	// Если компонент не смонтирован, возвращаем null, чтобы избежать ошибок рендера
	if (!mounted) {
		return null
	}

	if (!menu) {
		return (
			<div className='flex border border-[var(--border)] w-8 rounded-md overflow-hidden h-8'>
				<CurrentTheme theme={theme} />
			</div>
		)
	}

	return (
		<div className='flex border border-[var(--border)] w-24 rounded-md overflow-hidden h-8'>
			<div
				onClick={() => setTheme('light')}
				className={`flex hover:bg-[var(--first)] transition-colors duration-150 w-1/3 items-center justify-center ${
					theme === 'light' ? 'bg-[var(--third)]' : 'bg-[var(--second)]'
				}`}
			>
				<BsSunFill size='16px' />
			</div>
			<div
				onClick={() => setTheme('dark')}
				className={`flex hover:bg-[var(--first)] transition-colors duration-150 w-1/3 items-center justify-center ${
					theme === 'dark' ? 'bg-[var(--third)]' : 'bg-[var(--second)]'
				}`}
			>
				<BsMoonStars size='16px' />
			</div>
			<div
				onClick={() => setTheme('system')}
				className={`flex hover:bg-[var(--first)] transition-colors duration-150 w-1/3 items-center justify-center ${
					theme === 'system' ? 'bg-[var(--third)]' : 'bg-[var(--second)]'
				}`}
			>
				<MdDisplaySettings size='16px' />
			</div>
		</div>
	)
}

export default ThemeChangeComponent
