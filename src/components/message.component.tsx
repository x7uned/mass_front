import { User } from '@/app/chat/[id]/page'
import { FC } from 'react'

interface MessageProps {
	sender: User | undefined
	content: string
	isOwnMessage: boolean
}

const MessageComponent: FC<MessageProps> = ({
	sender,
	content,
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
			</div>
		</div>
	)
}

export default MessageComponent
