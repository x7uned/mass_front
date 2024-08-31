import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { default as axiosInstance } from '../axios'

interface Contact {
	id: string
	name: string
	email: string
	phone?: string
	avatar?: string
}

const initialState = {
	contacts: [] as Contact[],
}

export interface CreateContactFetch {
	contactId: number
}

export interface UpdateContactFetch {
	id: string
	name?: string
	email?: string
	phone?: string
	avatar?: string
}

export interface DeleteContactFetch {
	id: string
}

const contactsSlice = createSlice({
	name: 'contacts',
	initialState,
	reducers: {
		setContacts(state, action) {
			state.contacts = action.payload
		},
		clearContacts(state) {
			state.contacts = []
		},
	},
})

export const fetchCreateContact = createAsyncThunk(
	'contacts/fetchCreateContact',
	async (contactData: CreateContactFetch) => {
		try {
			const response = await axiosInstance.post('contacts/create', contactData)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

export const fetchUpdateContact = createAsyncThunk(
	'contacts/fetchUpdateContact',
	async (contactData: UpdateContactFetch) => {
		try {
			const response = await axiosInstance.put(
				`contacts/update/${contactData.id}`,
				contactData
			)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

export const fetchDeleteContact = createAsyncThunk(
	'contacts/fetchDeleteContact',
	async (contactData: DeleteContactFetch) => {
		try {
			const response = await axiosInstance.delete(
				`contacts/delete/${contactData.id}`
			)
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

export const fetchGetContacts = createAsyncThunk(
	'contacts/fetchGetContacts',
	async () => {
		try {
			const response = await axiosInstance.get('contacts/get')
			return response.data
		} catch (error) {
			console.error('Something went wrong', error)
		}
	}
)

interface fetchFindInfoInterface {
	contactId: string
}

export const fetchFindInfo = createAsyncThunk(
	'user/fetchFindInfo',
	async (data: fetchFindInfoInterface) => {
		try {
			const response = await axiosInstance.get(
				`contacts/getInfo?contactId=${data.contactId}`
			)
			return response.data
		} catch (error) {
			console.error('Something went wrong #findUser', error)
		}
	}
)

export const { setContacts, clearContacts } = contactsSlice.actions
export default contactsSlice.reducer
