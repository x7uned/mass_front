import Link from 'next/link'
import { FC } from 'react'
import { Contact } from './layouts/chat.layout'

interface MessageProps {
	contact: Contact
}

const timeAgo = (input: string | Date): string => {
	const date = typeof input === 'string' ? new Date(input) : input
	const now = new Date()
	const diff = Math.floor((now.getTime() - date.getTime()) / 60000)

	if (diff < 1) return 'Just now'
	if (diff < 60) return `${diff} minute(s) ago`

	const hours = Math.floor(diff / 60)
	if (hours < 24) return `${hours} hour(s) ago`

	const days = Math.floor(hours / 24)
	return `${days} day(s) ago`
}

const ContactComponent: FC<MessageProps> = ({ contact }) => {
	return (
		<Link key={contact.id} href={`/chat/${contact.id}`}>
			<div className='flex h-16 items-center gap-2 py-1 px-2 bg-[var(--second)] rounded-lg'>
				<div className='flex w-1/3 justify-center'>
					<div
						style={{
							backgroundImage: `url(${
								contact.user.avatar
									? contact.user.avatar
									: `https://ui-avatars.com/api/?name=${contact.user.username.trim()}`
							})`,
						}}
						className={`bg-center border-green-400 ${
							contact.user.isOnline ? 'border-2' : ''
						} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
					></div>
				</div>
				<div className='flex overflow-hidden items-start justify-center h-full w-2/3 text-center flex-col'>
					<p>{contact.user.username}</p>
					<p className='text-xs'>{timeAgo(contact?.updatedAt)}</p>
				</div>
			</div>
		</Link>
	)
}

export default ContactComponent
