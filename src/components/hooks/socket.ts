import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const socketUrl = 'http://localhost:4444'

interface Message {
	id: number
	content: string
	ownerId: number
	contactId: number
	createdAt: string
}

export function useChatSocket(contactId: number, accessToken: string) {
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState<string>('')
	const [userStatuses, setUserStatuses] = useState<number[]>([])
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const socketRef = useRef<Socket | null>(null)

	const startFunc = () => {
		if (socketRef.current) return
		if (accessToken) {
			console.log('Creating socket connection')
			socketRef.current = io(socketUrl, {
				extraHeaders: {
					authorization: `Bearer ${accessToken}`,
				},
			})

			const socket = socketRef.current

			socket.emit('fetchMessages', { contactId })

			const getStatus = () => {
				socket.emit('getStatus')
			}

			setInterval(getStatus, 15000)

			socket.on('message', (message: Message) => {
				console.log('Received message:', message)
				setMessages(prevMessages => [...prevMessages, message])
				scrollToBottom()
			})

			socket.on('fetchMessages', (fetchedMessages: Message[]) => {
				console.log('Fetched messages:', fetchedMessages)
				setMessages(fetchedMessages)
				scrollToBottom()
			})

			socket.on('userStatuses', (statuses: number[]) => {
				console.log('Received user statuses:', statuses)
				setUserStatuses(statuses)
			})

			socket.on('connect_error', error => {
				console.error('Socket connection error:', error)
			})

			socket.on('error', error => {
				console.error('Socket error:', error)
			})
		}
	}

	useEffect(() => {
		startFunc()

		// Cleanup function
		return () => {
			if (socketRef.current) {
				console.log('Cleanup socket connection')
				socketRef.current.disconnect()
				socketRef.current = null
			}
		}
	}, [accessToken, contactId])

	const sendMessage = () => {
		const socket = socketRef.current
		if (socket && newMessage.trim()) {
			console.log(contactId, newMessage)
			socket.emit('message', { contactId, content: newMessage })
			setNewMessage('')
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	return {
		messages,
		newMessage,
		setNewMessage,
		sendMessage,
		messagesEndRef,
		userStatuses,
	}
}
