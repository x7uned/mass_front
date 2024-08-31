'use client'

import { fetchCreateContact } from '@/redux/slices/contacts.slice'
import { fetchFindUsername } from '@/redux/slices/user.slice'
import { useAppDispatch } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { MdGroupAdd } from 'react-icons/md'
import useDebounce from './hooks/useDebouce'

interface MiniUsers {
	id: number
	username: string
	avatar: string | null
	isOnline: boolean
}

const SearchBar = () => {
	const [findParams, setFindParams] = useState<string>('')
	const [result, setResult] = useState<MiniUsers[]>([])
	const dispatch = useAppDispatch()
	const router = useRouter()
	const debouncedSearchTerm = useDebounce(findParams, 1000)

	const find = async () => {
		try {
			const fetch = await dispatch(fetchFindUsername(findParams))

			if (fetch.payload.users && fetch.payload.success) {
				setResult(fetch.payload.users)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const create = async (id: number) => {
		try {
			const fetch = await dispatch(fetchCreateContact({ contactId: id }))

			console.log(fetch)

			if (fetch.payload.id && fetch.payload.success) {
				router.push(`/chat/${fetch.payload.id}`)
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (debouncedSearchTerm) {
			find()
		}
	}, [debouncedSearchTerm])

	return (
		<>
			<div className='relative mt-6 w-full flex'>
				<AiOutlineSearch
					className='absolute mt-[2px] top-2 left-3'
					size='20px'
				/>
				<input
					placeholder='Search by username...'
					className='pl-10 bg-[var(--second)] rounded-[8px] w-full h-10 focus:outline-none placeholder:text-sm'
					value={findParams}
					onChange={e => {
						setFindParams(e.target.value)
						if (e.target.value === '') {
							setResult([])
						}
					}}
				/>
			</div>
			<div
				className={`flex mt-2 flex-col gap-2 px-3 py-2 rounded-lg w-full bg-[var(--second)] ${
					result.length !== 0 ? 'opacity-100' : 'opacity-0'
				} transition-all duration-300`}
			>
				{result.map(u => (
					<div key={u.id} className='flex justify-between items-center gap-2'>
						<div
							style={{
								backgroundImage: `url(${
									u.avatar
										? u.avatar
										: `https://ui-avatars.com/api/?name=${u.username.trim()}`
								})`,
							}}
							className={`bg-center border-green-400 ${
								u.isOnline ? 'border-2' : ''
							} rounded-full w-12 h-12 bg-no-repeat bg-cover`}
						></div>
						<p className='w-20 truncate'>{u.username}</p>
						<MdGroupAdd
							onClick={() => create(u.id)}
							size='26px'
							className='cursor-pointer'
						/>
					</div>
				))}
			</div>
		</>
	)
}

export default SearchBar
