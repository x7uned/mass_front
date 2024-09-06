import { FC } from 'react'
import { User } from './hooks/socket'

interface MessageProps {
	sender:
		| {
				username: string
				avatar: string | null | undefined
				status: string
				email: string
		  }
		| User
	content: string
	isOwnMessage: boolean
	date: Date
}

const formatTime = (datestr: Date): string => {
	const date = new Date(datestr)
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	return `${hours}:${minutes}`
}

const MessageComponent: FC<MessageProps> = ({
	sender,
	content,
	date,
	isOwnMessage,
}) => {
	return (
		<div
			className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
		>
			<div
				className={`max-w-xs px-4 py-2 rounded-lg shadow ${
					isOwnMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
				}`}
			>
				{!isOwnMessage && (
					<p className='text-xs font-semibold mb-1'>{sender?.username}</p>
				)}
				<p className='text-sm'>{content}</p>
				<p className='text-end'>{formatTime(date)}</p>
			</div>
		</div>
	)
}

export default MessageComponent
