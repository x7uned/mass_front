'use client'

import MessageComponent from '@/components/message.component'
import { useSession } from 'next-auth/react'
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from 'react'
import { IoIosCall, IoIosVideocam } from 'react-icons/io'
import { IoInformationCircle } from 'react-icons/io5'
import { TbSend } from 'react-icons/tb'
import { Contact, Message } from './hooks/socket'

interface ChatComponentProps {
	contact: Contact
	userStatuses: number[]
	messages: Message[]
	messagesEndRef: RefObject<HTMLDivElement>
	setNewMessage: Dispatch<SetStateAction<string>>
	sendMessage: () => void
	newMessage: string
}

const timeAgo = (datestr: string | Date): string => {
	const date = new Date(datestr)
	const now = new Date()
	const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
	if (diff < 1) return 'Just now'
	if (diff < 60) return `${diff} minute(s) ago`
	const hours = Math.floor(diff / 60)
	if (hours < 24) return `${hours} hour(s) ago`
	const days = Math.floor(hours / 24)
	return `${days} day(s) ago`
}

const ChatComponent = ({
	contact,
	userStatuses,
	messages,
	messagesEndRef,
	setNewMessage,
	sendMessage,
	newMessage,
}: ChatComponentProps) => {
	const { data: session } = useSession()
	const messagesContainerRef = useRef<HTMLDivElement>(null)

	const isOnline: boolean =
		contact.members.length === 2
			? userStatuses.includes(contact.members[0].id)
			: false

	const isGroup: boolean = contact.members.length > 2

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages, messagesEndRef])

	const contactInfo = isGroup
		? {
				username: contact.name,
				avatar: contact.avatar,
				status: 'Group Chat',
				email: 'N/A',
		  }
		: contact.members[0]

	return (
		<div className='w-full flex h-screen'>
			<div className='flex flex-col w-3/4 h-screen'>
				{contact ? (
					<div className='flex w-full justify-between p-4 h-1/6 bg-[var(--first)]'>
						<div className='flex items-center'>
							<div
								style={{
									backgroundImage: `url(${
										contact.avatar ||
										`https://ui-avatars.com/api/?name=${contactInfo.username.trim()}`
									})`,
								}}
								className={`bg-center border-green-400 ${
									isOnline ? 'border-2' : ''
								} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
							></div>
							<div className='flex flex-col ml-4'>
								<p>{contactInfo.username}</p>
								<div>
									{isOnline ? (
										<p className='text-green-400'>Online</p>
									) : (
										<p className='text-gray-400'>
											{isGroup && contact.members[0].lastOnline
												? timeAgo(contact.members[0].lastOnline)
												: 'Offline'}
										</p>
									)}
								</div>
							</div>
						</div>
						<div className='flex gap-3 items-center'>
							<IoIosCall className='text-gray-400' size='25px' />
							<IoIosVideocam className='text-gray-400' size='25px' />
							<IoInformationCircle className='text-gray-400' size='25px' />
						</div>
					</div>
				) : (
					<div className='flex justify-center items-center h-full'>
						<p className='text-gray-500'>No user data available.</p>
					</div>
				)}
				<div
					ref={messagesContainerRef}
					className='flex flex-col h-5/6 px-4 overflow-y-auto no-scrollbar'
				>
					{messages.length === 0 ? (
						<div className='flex justify-center items-center h-full'>
							<p className='text-gray-500'>
								This is a new chat. Start a conversation!
							</p>
						</div>
					) : (
						messages.map(message => (
							<MessageComponent
								key={message.id}
								content={message.content}
								sender={contactInfo}
								date={message.createdAt}
								isOwnMessage={message.ownerId === (session?.user?.id || 0)}
							/>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
				<div className='static flex h-24 bg-[var(--first)] items-center bottom-0 w-full'>
					<div className='flex w-full px-4'>
						<div className='relative px-4 h-12 rounded-[8px] overflow-hidden bg-[var(--second)] w-full flex'>
							<input
								placeholder='Your message...'
								onChange={e => setNewMessage(e.target.value)}
								value={newMessage}
								className='bg-[var(--second)] w-full h-12 focus:outline-none'
							/>
							<div className='flex'>
								<button
									onClick={sendMessage}
									className='px-4 py-2 rounded-md ml-2'
								>
									<TbSend size='20px' />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='flex justify-center w-1/4 h-screen bg-[var(--first)]'>
				{contact ? (
					<div className='flex flex-col h-screen w-full'>
						<div
							style={{
								backgroundImage: `url(${
									contactInfo.avatar ||
									`https://ui-avatars.com/api/?name=${contactInfo.username.trim()}`
								})`,
							}}
							className='bg-center w-full h-64 bg-no-repeat bg-cover'
						></div>
						<div className='flex w-full mt-4 px-2 py-2'>
							<div className='flex w-full p-2 pb-3 rounded-xl flex-col bg-[var(--second)]'>
								<p className='text-lg'>Username</p>
								<p className='text-md text-[var(--main)]'>
									@{contactInfo.username}
								</p>
								<p className='text-lg'>Status</p>
								<p className='text-md text-[var(--main)]'>
									{contactInfo.status}
								</p>
								<p className='text-lg'>Email</p>
								<p className='text-md text-[var(--main)]'>
									{contactInfo.email || 'N/A'}
								</p>
								<p className='text-lg'>Online</p>
								{isOnline ? (
									<p className='text-green-400'>Online</p>
								) : (
									<p className='text-gray-400'>
										{isGroup ? 'Offline' : 'Offline'}
									</p>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className='flex'>
						<p>Skeleton</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default ChatComponent
