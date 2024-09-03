'use client'

import { Poppins } from 'next/font/google'
import { BiMessageSquareEdit } from 'react-icons/bi'
import ContactComponent from '../contact.component'
import { Contact } from '../hooks/socket'
import SearchBar from '../search.bar'

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
})

const ChatLayoutComponent = ({
	children,
	statuses,
	contacts,
}: Readonly<{
	children: React.ReactNode
	statuses: number[]
	contacts: Contact[]
}>) => {
	return (
		<div className={`flex background w-full ${poppins.className}`}>
			<div className='flex flex-col bg-[var(--first)] w-1/4 pt-6 px-6 h-screen'>
				<div className='flex w-full justify-between'>
					<p className='text-2xl font-medium'>Messages</p>
					<BiMessageSquareEdit className='text-[var(--main)]' size='30px' />
				</div>
				<SearchBar />
				<div className='flex mt-6 gap-2 flex-col'>
					{contacts.map(contact => (
						<ContactComponent
							key={contact.id}
							contact={contact}
							isOnline={statuses?.includes(contact.id)}
						/>
					))}
				</div>
			</div>
			<div className='flex w-3/4 h-screen'>{children}</div>
		</div>
	)
}

export default ChatLayoutComponent
