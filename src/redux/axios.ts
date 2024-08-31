import axios from 'axios'
import { getSession } from 'next-auth/react'

const axiosInstance = axios.create({
	baseURL: process.env.BACKEND_URL || 'http://localhost:4444/',
})

axiosInstance.interceptors.request.use(
	async config => {
		try {
			const session = await getSession()
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`
			}
		} catch (error) {
			console.error('Axios error', error)
		}
		return config
	},
	error => Promise.reject(error)
)

export default axiosInstance
