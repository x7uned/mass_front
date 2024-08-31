import 'next-auth'

declare module 'next-auth' {
	interface Session {
		accessToken: string
		expires: string
		user: {
			id: string
			email: string
			username: string
			avatar: string
			status: string
		}
	}
}
