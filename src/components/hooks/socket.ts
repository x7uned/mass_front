import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const socketUrl = 'http://localhost:4444'

export interface User {
	id: number
	username: string
	email: string
	password: string
	avatar?: string | null
	description?: string | null
	status: string
	friends: number[]
	lastOnline?: Date | null
	isOnline: boolean
	sentMessages: Message[]
	contacts: Contact[]
	contactOf: Contact[]
}

export interface Message {
	id: number
	content: string
	createdAt: Date
	contactId: number
	ownerId: number
	contact: Contact
	owner: User
}

export interface Contact {
	id: number
	ownerId: number
	name: string
	avatar?: string | null
	members: User[]
	updatedAt: Date
	lastMessage: string
	messageCount: number
	owner: User
	messages: Message[]
}

export function useChatSocket(contactId: number, accessToken: string) {
	const [messages, setMessages] = useState<Message[]>([])
	const [contacts, setContacts] = useState<Contact[]>([])
	const [endOfChat, setEndOfChat] = useState(false)
	const [gap, setGap] = useState<number>(0)
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

			socket.emit('fetchMessages', { contactId, gap })
			socket.emit('fetchContacts')

			const getStatus = () => {
				socket.emit('getStatus')
			}

			setInterval(getStatus, 15000)

			socket.on('message', (message: Message) => {
				setMessages(prevMessages => [...prevMessages, message])
				if (message.contactId === contactId) socket.emit('fetchContacts')
			})

			socket.on('fetchMessages', (fetchedMessages: Message[]) => {
				console.log('Fetched messages:', fetchedMessages)
				setMessages(fetchedMessages)
				setGap(prev => prev + 1)
			})

			socket.on('fetchNewMessages', (fetchedMessages: Message[]) => {
				console.log('Fetched NEW messages:', fetchedMessages)
				if (fetchedMessages.length < 24) {
					console.log(endOfChat)
					setEndOfChat(true)
				}
				setMessages(prev => [...fetchedMessages, ...prev])
			})

			socket.on('fetchContacts', (fetchedContacts: Contact[]) => {
				console.log('Fetched contacts:', fetchedContacts)
				setContacts(fetchedContacts)
			})

			socket.on('userStatuses', (statuses: number[]) => {
				console.log('statuses updated')
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

	const fetchNewMessages = () => {
		const socket = socketRef.current
		if (!socket || endOfChat) {
			console.log(
				'End of chat reached or no socket connection. Skipping fetch.'
			)
			return
		}

		console.log('Fetching messages with gap:', gap)
		socket.emit('fetchMessages', { contactId, gap })
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	return {
		messages,
		contacts,
		newMessage,
		setNewMessage,
		sendMessage,
		messagesEndRef,
		userStatuses,
		fetchNewMessages, // Не забываем возвращать функцию для подгрузки новых сообщений
	}
}
