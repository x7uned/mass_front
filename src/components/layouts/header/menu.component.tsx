'use client'

import Link from 'next/link'
import { FaQuoteRight } from 'react-icons/fa6'
import { HiOutlineChatAlt2 } from 'react-icons/hi'
import { LuLayoutDashboard } from 'react-icons/lu'
import { RiSettings2Line } from 'react-icons/ri'

const MenuComponent = ({ menu, page }: { menu: boolean; page: string }) => {
	return (
		<div className='flex flex-col gap-2'>
			<Link href='/'>
				<div
					className={`flex ${
						menu
							? `w-36 ${page == '/' ? 'bg-gradient' : ''} gap-2`
							: `w-12 ${page == '/' ? 'bg-center-gradient' : ''}`
					} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
				>
					<LuLayoutDashboard size={'24px'} />
					<p>{menu ? 'Dashboard' : ''}</p>
				</div>
			</Link>
			<Link href='/chat/0'>
				<div
					className={`flex ${
						menu
							? `w-36 ${page.includes('/chat') ? 'bg-gradient' : ''} gap-2`
							: `w-12 ${page.includes('/chat') ? 'bg-center-gradient' : ''}`
					} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
				>
					<HiOutlineChatAlt2 size={'24px'} />
					<p>{menu ? 'Chat' : ''}</p>
				</div>
			</Link>
			<div
				className={`flex ${
					menu
						? `w-36 ${page.includes('/settings') ? 'bg-gradient' : ''} gap-2`
						: `w-12 ${page.includes('/settings') ? 'bg-center-gradient' : ''}`
				} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
			>
				<RiSettings2Line size={'24px'} />
				<p>{menu ? 'Settings' : ''}</p>
			</div>
			<div
				className={`flex ${
					menu
						? `w-36 ${page.includes('/faq') ? 'bg-gradient' : ''} gap-2`
						: `w-12 ${page.includes('/faq') ? 'bg-center-gradient' : ''}`
				} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
			>
				<FaQuoteRight size={'24px'} />
				<p>{menu ? 'FAQ' : ''}</p>
			</div>
		</div>
	)
}

export default MenuComponent
