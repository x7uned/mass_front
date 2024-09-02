'use client'

import { User } from '@/app/chat/[id]/page'
import { fetchGetContacts } from '@/redux/slices/contacts.slice'
import { useAppDispatch } from '@/redux/store'
import { Poppins } from 'next/font/google'
import { useEffect, useState } from 'react'
import { BiMessageSquareEdit } from 'react-icons/bi'
import ContactComponent from '../contact.component'
import SearchBar from '../search.bar'

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
})

export interface Contact {
	id: number
	userId: number
	contactId: number
	updatedAt: Date
	messageCount: number
	user: User
}

const ChatLayoutComponent = ({
	children,
	statuses,
}: Readonly<{
	children: React.ReactNode
	statuses: number[]
}>) => {
	const [contacts, setContacts] = useState<Contact[]>([])
	const dispatch = useAppDispatch()

	const getContacts = async () => {
		const fetch = await dispatch(fetchGetContacts())

		if (fetch.payload?.success && fetch.payload.contactResults) {
			setContacts(fetch.payload.contactResults)
		}
	}

	useEffect(() => {
		getContacts()
	}, [])

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
