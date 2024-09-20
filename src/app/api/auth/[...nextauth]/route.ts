import axiosInstance from '@/redux/axios'
import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

interface DecodedUser {
	username?: string
	email?: string
	avatar?: string
	id?: number
	access_token?: string
	admin: boolean
	[key: string]: any
}

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID || '',
			clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials) return null

				try {
					const { username, password } = credentials
					const res = await axiosInstance.post('auth/login', {
						username,
						password,
					})

					if (res.data.success && res.data.access_token) {
						return {
							...res.data.user,
							access_token: res.data.access_token,
							admin: res.data.admin,
						}
					} else {
						return null
					}
				} catch (error) {
					console.error('Authorization error')
					return null
				}
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user, account }: { user: DecodedUser; account: any }) {
			if (account?.provider === 'google') {
				try {
					const fetchArray = {
						username: user.name || '',
						email: user.email || '',
						avatar: user.image || '',
						sub: user.id || '',
					}

					const response = await axios.post(
						`${process.env.BACKEND_URL}/auth/oauth`,
						fetchArray
					)

					if (response.data.success || response.data.access_token) {
						user.access_token = response.data.access_token
						user.admin = response.data.admin
						return true
					} else {
						console.error('Backend sign-in failed:', response.data.message)
						return false
					}
				} catch (error: any) {
					if (error.response && error.response.status === 409) {
						return true
					} else if (error.response && error.response.status === 404) {
						return false
					} else {
						console.error('Error sending user data to backend:', error)
						return false
					}
				}
			} else if (account?.provider === 'credentials') {
				return true
			}
			return false
		},
		async session({ session, token }: { session: any; token: any }) {
			if (token) {
				session.accessToken = token.access_token

				try {
					const response = await axiosInstance.get('auth/me', {
						headers: {
							Authorization: `${token.access_token}`,
						},
					})

					if (response.data.success) {
						const user = response.data.user

						session.user.id = user.id
						session.user.email = user.email
						session.user.username = user.username
						session.user.avatar = user.avatar
						session.user.status = user.status
					} else {
						return null
					}
				} catch (error) {
					return null
				}
			}
			return session
		},
		async jwt({ token, user }: { token: any; user: any }) {
			if (user) {
				token.id = user.id
				token.email = user.email
				token.username = user.username
				token.avatar = user.avatar
				token.access_token = user.access_token
			}
			return token
		},
	},
})

export { handler as GET, handler as POST }
