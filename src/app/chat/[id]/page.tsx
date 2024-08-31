'use client'

import { useChatSocket } from '@/components/hooks/socket'
import ChatLayoutComponent from '@/components/layouts/chat.layout'
import MessageComponent from '@/components/message.component'
import LoadingScreen from '@/components/screens/loading.screen'
import { fetchFindInfo } from '@/redux/slices/contacts.slice'
import { useAppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IoIosCall, IoIosVideocam } from 'react-icons/io'
import { IoInformationCircle } from 'react-icons/io5'
import { TbSend } from 'react-icons/tb'

export interface User {
	avatar: string | null
	description: string | null
	email: string
	id: number
	status: string
	username: string
	isOnline: boolean
	lastOnline: string
}

const timeAgo = (date: Date): string => {
	const now = new Date()
	const diff = Math.floor((now.getTime() - date.getTime()) / 60000)
	if (diff < 1) return 'Just now'
	if (diff < 60) return `${diff} minute(s) ago`
	const hours = Math.floor(diff / 60)
	if (hours < 24) return `${hours} hour(s) ago`
	const days = Math.floor(hours / 24)
	return `${days} day(s) ago`
}

const ChatComponent = () => {
	const dispatch = useAppDispatch()
	const params = useParams<{ id: string }>()
	const [receiver, setReceiver] = useState<User>()
	const [loading, setLoading] = useState<boolean>(true)
	const [errorScreen, setErrorScreen] = useState<boolean>(false)
	const { data: session } = useSession()
	const {
		messages = [],
		newMessage,
		setNewMessage,
		sendMessage,
		messagesEndRef,
		userStatuses,
	} = useChatSocket(Number(params.id), session?.accessToken as string)
	const messagesContainerRef = useRef<HTMLDivElement>(null)

	const findInfo = async () => {
		try {
			if (params.id) {
				const fetchParams = { contactId: params.id }
				const fetch = await dispatch(fetchFindInfo(fetchParams))
				if (fetch.payload.success && fetch.payload.user) {
					setReceiver(fetch.payload.user)
					setLoading(false)
				} else {
					setLoading(false)
					setErrorScreen(true)
					console.log(fetch)
				}
			}
		} catch (error) {
			setErrorScreen(true)
			console.error(error)
		}
	}

	useEffect(() => {
		if (params.id) {
			findInfo()
		}
	}, [params.id])

	useLayoutEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight
		}
	}, [messages])

	if (loading) {
		return <LoadingScreen />
	}

	if (errorScreen) {
		return (
			<div className='flex h-screen w-full items-center justify-center'>
				<p>Error</p>
			</div>
		)
	}

	const receiverStatus = userStatuses.get(receiver?.id ?? 0)

	return (
		<ChatLayoutComponent>
			<div className='w-full flex h-screen'>
				<div className='flex flex-col w-3/4 h-screen'>
					{receiver ? (
						<div className='flex w-full justify-between p-4 h-1/6 bg-[var(--first)]'>
							<div className='flex items-center'>
								<div
									style={{
										backgroundImage: `url(${
											receiver.avatar
												? receiver.avatar
												: `https://ui-avatars.com/api/?name=${receiver.username.trim()}`
										})`,
									}}
									className={`bg-center border-green-400 ${
										receiver.isOnline ? 'border-2' : ''
									} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
								></div>
								<div className='flex flex-col ml-4'>
									<p>{receiver.username}</p>
									<div>
										{receiver?.isOnline ? (
											<p className='text-green-400'>Online</p>
										) : (
											<p className='text-gray-400'>
												{receiver?.lastOnline
													? timeAgo(new Date(receiver?.lastOnline))
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
									sender={receiver}
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
										onClick={() => sendMessage()}
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
					{receiver ? (
						<div className='flex flex-col h-screen w-full'>
							<div
								style={{
									backgroundImage: `url(${
										receiver?.avatar
											? receiver.avatar
											: `https://ui-avatars.com/api/?name=${receiver?.username.trim()}`
									})`,
								}}
								className='bg-center w-full h-64 bg-no-repeat bg-cover'
							></div>
							<div className='flex w-full mt-4 px-2 py-2'>
								<div className='flex w-full p-2 pb-3 rounded-xl flex-col bg-[var(--second)]'>
									<p className='text-lg'>Username</p>
									<p className='text-md text-[var(--main)]'>
										@{receiver.username}
									</p>
									<p className='text-lg'>Status</p>
									<p className='text-md text-[var(--main)]'>
										{receiver.status}
									</p>
									<p className='text-lg'>Email</p>
									<p className='text-md text-[var(--main)]'>{receiver.email}</p>
									<p className='text-lg'>Online</p>
									{receiverStatus?.online ? (
										<p className='text-green-400'>Online</p>
									) : (
										<p className='text-gray-400'>
											{receiverStatus?.lastOnline
												? timeAgo(new Date(receiverStatus.lastOnline))
												: 'Offline'}
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
		</ChatLayoutComponent>
	)
}

export default ChatComponent
