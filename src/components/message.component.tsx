import { useSession } from 'next-auth/react'
import { FC, useState } from 'react'
import { Message } from './hooks/socket'

interface MessageProps {
	message: Message
}

const formatTime = (datestr: Date): string => {
	const date = new Date(datestr)
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	return `${hours}:${minutes}`
}

function isImageUrl(url: string): boolean {
	return /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url)
}

function isUrl(content: string): boolean {
	try {
		new URL(content)
		return true
	} catch {
		return false
	}
}

const MessageComponent: FC<MessageProps> = ({ message }) => {
	const { createdAt, content } = message
	const { data: session } = useSession()
	const isOwnMessage = message.owner.id === (session?.user?.id || 0)
	const sender = message.owner

	const [imageError, setImageError] = useState(false)
	const [selected, setSelected] = useState(false)
	const [menu, setMenu] = useState(false)

	return (
		<div
			onMouseEnter={() => setMenu(true)}
			onMouseLeave={() => setMenu(false)}
			className={`flex py-1 px-4 transition-all duration-100 ${
				isOwnMessage ? 'justify-end' : 'justify-start'
			} ${selected ? 'bg-[var(--first)]' : ''}`}
		>
			<div
				style={{
					backgroundImage: `url(${
						sender.avatar ||
						`https://ui-avatars.com/api/?name=${sender.username.trim()}`
					})`,
				}}
				className={`bg-center ${
					isOwnMessage ? 'hidden' : ''
				} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
			></div>
			<div
				className={`flex transition-all duration-100 justify-center flex-col ${
					isOwnMessage && menu
						? 'opacity-100 mr-4'
						: 'opacity-0 pointer-events-none'
				}`}
			>
				<input
					onChange={() => {
						setSelected(prev => !prev)
					}}
					type='checkbox'
				/>
				<button>X</button>
			</div>
			<div
				className={`max-w-xs px-2 py-2 rounded-lg shadow ${
					isOwnMessage ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
				}`}
			>
				{!isOwnMessage && (
					<p className='text-xs font-semibold mb-1'>{sender?.username}</p>
				)}
				{isImageUrl(content) && !imageError && (
					<div
						style={{ backgroundImage: `url(${content})` }}
						className='flex rounded-md h-32 w-full bg-center bg-cover bg-no-repeat mb-3'
						onError={() => setImageError(true)} // Обрабатываем ошибку загрузки
					></div>
				)}
				{imageError && (
					<div className='flex rounded-lg h-32 w-full bg-gray-300 mb-3'></div>
				)}
				{isUrl(content) ? (
					<a
						href={content}
						target='_blank'
						rel='noopener noreferrer'
						className='text-sm text-blue-600 underline break-all'
					>
						{content}
					</a>
				) : (
					<p className='text-sm px-2 break-all'>{content}</p>
				)}
				<p className='text-end px-2'>{formatTime(createdAt)}</p>
			</div>
		</div>
	)
}

export default MessageComponent
