import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { default as axiosInstance } from '../axios'

const initialState = {
	user: null,
}

export interface SignUpFetch {
	email: string
	username: string
	password: string
}

export interface ChangeProfileFetch {
	avatar?: string
	username: string
	banner?: string
	description?: string
}

export interface SignInFetch {
	email: string
	password: string
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload
		},
		clearUser(state) {
			state.user = null
		},
	},
})

export const fetchSignUp = createAsyncThunk(
	'user/fetchSignUp',
	async (userData: SignUpFetch) => {
		try {
			const response = await axiosInstance.post('auth/register', userData)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

export const fetchEditProfile = createAsyncThunk(
	'user/fetchEditProfile',
	async (userData: ChangeProfileFetch) => {
		try {
			const response = await axiosInstance.put('auth/updateProfile', userData)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

interface fetchFindUserInterface {
	id: string
}

export const fetchFindUser = createAsyncThunk(
	'user/fetchFindUser',
	async (data: fetchFindUserInterface) => {
		try {
			const response = await axiosInstance.get(`auth/find?id=${data.id}`)
			return response.data
		} catch (error) {
			console.error('Something went wrong #findUser', error)
		}
	}
)

export const fetchGetFriends = createAsyncThunk(
	'user/fetchGetFriends',
	async () => {
		try {
			const response = await axiosInstance.get(`auth/friends`)
			return response.data
		} catch (error) {
			console.error('Something went wrong #getFriends', error)
		}
	}
)

export const fetchFindUsername = createAsyncThunk(
	'user/fetchFindUsername',
	async (params: string) => {
		try {
			const response = await axiosInstance.get(`auth/many?username=${params}`)
			return response.data
		} catch (error) {
			console.error('Something went wrong #findUser', error)
		}
	}
)

export const fetchSignIn = createAsyncThunk(
	'user/fetchSignIn',
	async (userData: SignInFetch) => {
		try {
			const response = await axiosInstance.post('auth/login', userData)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
