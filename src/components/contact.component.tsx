'use client'

import Link from 'next/link'
import { FC } from 'react'
import { Contact } from './hooks/socket'

interface MessageProps {
	contact: Contact
	isOnline: boolean
}

const ContactComponent: FC<MessageProps> = ({ contact, isOnline }) => {
	let avatar = contact.avatar

	return (
		<Link key={contact.id} href={`/chat/${contact.id}`}>
			<div
				onClick={() => console.log(contact)}
				className='flex h-16 items-center gap-2 py-1 px-2 bg-[var(--second)] rounded-lg'
			>
				<div className='flex w-1/3 justify-center'>
					<div
						style={{
							backgroundImage: `url(${
								avatar
									? avatar
									: `https://ui-avatars.com/api/?name=${contact.name.trim()}`
							})`,
						}}
						className={`bg-center border-green-400 ${
							isOnline ? 'border-2' : ''
						} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
					></div>
				</div>
				<div className='flex overflow-hidden items-start justify-center h-full w-2/3 text-start flex-col'>
					<p className='h-6 w-5/6 truncate'>{contact.name}</p>
					<p className='h-6 w-5/6 text-xs truncate'>{contact.lastMessage}</p>
				</div>
			</div>
		</Link>
	)
}

export default ContactComponent
