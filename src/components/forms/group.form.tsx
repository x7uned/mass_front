'use client'

import { fetchCreateGroup } from '@/redux/slices/contacts.slice'
import { fetchFindUsername, fetchGetFriends } from '@/redux/slices/user.slice'
import { useAppDispatch } from '@/redux/store'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import useDebounce from '../hooks/useDebouce'

// Схема валидации для формы
const schema = yup.object().shape({
	name: yup.string().min(3, 'Min 3 symbols').required('Group name is required'),
	avatar: yup.string().url('Invalid URL'),
	members: yup.array().of(yup.number()).min(1, 'Select at least one friend'),
})

export interface GroupFormInterface {
	name: string
	avatar: string
	members: number[]
}

interface MiniContact {
	id: number
	username: string
	avatar: string | null
}

const GroupForm = () => {
	const [error, setError] = useState('')
	const router = useRouter()
	const dispatch = useAppDispatch()
	const [findParams, setFindParams] = useState<string>('')
	const [friends, setFriends] = useState<MiniContact[]>([])
	const [searchRes, setSearchRes] = useState([])
	const debouncedSearchTerm = useDebounce(findParams, 1000)

	const onSubmit = async (data: any) => {
		try {
			// Логика для отправки данных на сервер, например через axios или fetch
			console.log('Form data', data)

			const fetch = await dispatch(fetchCreateGroup(data))

			console.log(fetch)
		} catch (error) {
			console.error('Error creating group:', error)
		}
	}

	const MiniContact = ({ friend }: { friend: MiniContact }) => {
		return (
			<div className='flex justify-between w-full items-center'>
				<div
					style={{
						backgroundImage: `url(${
							friend.avatar
								? friend.avatar
								: `https://ui-avatars.com/api/?name=${friend.username.trim()}`
						})`,
					}}
					className='flex w-[24px] rounded-full justify-end bg-no-repeat bg-cover bg-center h-[24px]'
				></div>
				<label htmlFor={`friend-${friend.id}`}>{friend.username}</label>
				<input
					type='checkbox'
					id={`friend-${friend.id}`}
					value={friend.id}
					{...register('members')}
				/>
			</div>
		)
	}

	const find = async () => {
		try {
			const fetch = await dispatch(fetchFindUsername(findParams))

			if (fetch.payload.users && fetch.payload.success) {
				setFriends(fetch.payload.users)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const getFriends = async () => {
		try {
			const fetch = await dispatch(fetchGetFriends())

			if (fetch.payload.friends && fetch.payload.success) {
				setFriends(fetch.payload.friends)
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		getFriends()
	}, [])

	useEffect(() => {
		if (debouncedSearchTerm) {
			find()
		}
	}, [debouncedSearchTerm])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	return (
		<div className='flex w-full px-6'>
			<form
				className='flex flex-col w-full pb-6'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex'>
					<div className='flex gap-3 w-1/2 flex-col'>
						<div className='relative'>
							<label htmlFor='name'>Group Name</label>
							<input
								id='name'
								{...register('name')}
								placeholder='New Group'
								className='w-full p-2 border rounded'
							/>
							{errors.name && (
								<span className='text-red-400'>{errors.name.message}</span>
							)}
						</div>
						<div className='relative'>
							<label htmlFor='name' onClick={() => console.log(friends)}>
								Group Avatar
							</label>
							<input
								id='avatar'
								placeholder='Avatar URL (Optional)'
								{...register('avatar')}
								className='w-full p-2 border rounded'
							/>
							{errors.avatar && (
								<span className='text-red-400'>{errors.avatar.message}</span>
							)}
						</div>
					</div>
					<div className='flex items-center flex-col w-1/2'>
						<div className='relative justify-center w-full flex'>
							<input
								placeholder='Search by username'
								className='pl-2 bg-[var(--first)] rounded-[6px] w-2/3 h-8 focus:outline-none placeholder:text-xs'
								value={findParams}
								onChange={e => {
									setFindParams(e.target.value)
									if (e.target.value === '') {
										setFriends([])
									}
								}}
							/>
						</div>
						<div className='relative mt-2 w-full'>
							<div className='flex flex-col w-full overflow-y-auto h-32 items-center gap-2'>
								{friends.map(friend => (
									<div key={friend.id} className='flex w-2/3'>
										<MiniContact friend={friend} />
									</div>
								))}
							</div>
							{errors.members && (
								<span className='text-red-400 mt-4'>
									{errors.members.message}
								</span>
							)}
						</div>
						{error && <span className='text-red-400'>{error}</span>}
					</div>
				</div>
				<button
					className='bg-[var(--third)] w-full py-2 rounded-md mt-3'
					type='submit'
				>
					Create Group
				</button>
			</form>
		</div>
	)
}

export default GroupForm
