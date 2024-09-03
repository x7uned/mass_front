'use client'

import ChatComponent from '@/components/chat.component'
import { useChatSocket } from '@/components/hooks/socket'
import ChatLayoutComponent from '@/components/layouts/chat.layout'
import LoadingScreen from '@/components/screens/loading.screen'
import { fetchFindInfo } from '@/redux/slices/contacts.slice'
import { useAppDispatch } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface User {
	avatar: string | null
	description: string | null
	email: string
	id: number
	status: string
	username: string
	isOnline: boolean
	friends: string[]
	lastOnline: string
}

const ChatComponentContainer = () => {
	const dispatch = useAppDispatch()
	const params = useParams<{ id: string }>()
	const [receiver, setReceiver] = useState<User>()
	const [loading, setLoading] = useState<boolean>(true)
	const [errorScreen, setErrorScreen] = useState<boolean>(false)
	const { data: session } = useSession()
	const {
		messages = [],
		contacts = [],
		newMessage,
		setNewMessage,
		sendMessage,
		messagesEndRef,
		userStatuses,
	} = useChatSocket(Number(params.id), session?.accessToken as string)

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

	return (
		<ChatLayoutComponent contacts={contacts} statuses={userStatuses}>
			<ChatComponent
				receiver={receiver!}
				userStatuses={userStatuses}
				messages={messages.filter(
					m =>
						m.contactId == Number(params.id) ||
						m.ownerId == Number(session?.user.id)
				)}
				messagesEndRef={messagesEndRef}
				setNewMessage={setNewMessage}
				sendMessage={sendMessage}
				newMessage={newMessage}
			/>
		</ChatLayoutComponent>
	)
}

export default ChatComponentContainer
