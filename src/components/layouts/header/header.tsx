'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { TbMessageChatbot } from 'react-icons/tb'
import MenuComponent from './menu.component'
import ThemeChangeComponent from './theme.component'
import UserComponent from './user.component'

const Header = () => {
	const [menu, setMenu] = useState<boolean>(false)
	const pathname = usePathname()

	return (
		<div
			onMouseEnter={() => setMenu(true)}
			onMouseLeave={() => setMenu(false)}
			className={`flex flex-col gap-4 justify-between items-center h-screen fixed z-20  ease-in-out ${
				menu ? 'w-40' : 'w-16'
			} transition-all bg-[var(--background)] overflow-hidden duration-150 border-r border-[var(--border)] py-6`}
		>
			<Link href='/'>
				<TbMessageChatbot size='40px' />
			</Link>
			<MenuComponent page={pathname} menu={menu} />
			<div className='flex flex-col gap-4 justify-center items-center'>
				<UserComponent page={pathname} menu={menu} />
				<ThemeChangeComponent menu={menu} />
			</div>
		</div>
	)
}

export default Header
