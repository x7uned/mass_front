'use client'

import ProfileModalComponent from '@/components/modals/profile.modal.component'
import LoadingScreen from '@/components/screens/loading.screen'
import { fetchFindUser } from '@/redux/slices/user.slice'
import { useAppDispatch } from '@/redux/store'
import { signOut, useSession } from 'next-auth/react'
import { Outfit, Titillium_Web } from 'next/font/google'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaUserSlash } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'
import { RiVipCrownLine } from 'react-icons/ri'
import {
	TbSquareRoundedLetterO,
	TbSquareRoundedLetterPFilled,
} from 'react-icons/tb'
import { VscSignOut } from 'react-icons/vsc'

export interface Profile {
	username: string
	email: string
	avatar: string
	description?: string
	status?: string
}

const titilium = Titillium_Web({ subsets: ['latin'], weight: ['600'] })
const outfit = Outfit({ subsets: ['latin'], weight: ['600'] })

const ProfilePage = () => {
	const params = useParams<{ id: string }>()
	const dispatch = useAppDispatch()
	const [currentUser, setCurrentUser] = useState<Profile>()
	const [notFound, setNotFound] = useState(false)
	const [loading, setLoading] = useState(true)
	const [profileEdit, setProfileEdit] = useState(false)
	const session = useSession()

	const owner = session.data?.user.id == params.id

	const findUser = async () => {
		const fetchpar = { id: params.id }
		const data = await dispatch(fetchFindUser(fetchpar))
		if (data.payload.user && data.payload.success) {
			setCurrentUser(data.payload.user)
		} else {
			setNotFound(true)
		}
		setLoading(false)
		return data
	}

	const updateProfile = () => {
		setProfileEdit(false)
		findUser()
	}

	useEffect(() => {
		findUser()
	}, [])

	if (loading)
		return (
			<div className='flex justify-center items-center w-screen h-screen'>
				<LoadingScreen />
			</div>
		)

	return (
		<div className='flex'>
			{currentUser && !notFound ? (
				<div
					className={`flex flex-col gap-2 sm:px-[20px] md:px-[60px] xl:px-[200px] items-center justify-start w-screen min-h-screen ${outfit.className}`}
				>
					<div className='flex flex-col items-center w-full'>
						<div
							style={{
								backgroundImage: `url(https://i.pinimg.com/564x/f6/41/90/f641905331279ff587d837a6e1d366c5.jpg)`,
							}}
							className='flex w-full p-3 justify-end bg-no-repeat bg-cover bg-center h-[120px]'
						>
							{owner && (
								<div className='flex size-8 bg-[--background] rounded-full justify-center items-center'>
									<FiEdit onClick={() => setProfileEdit(true)} size='20px' />
									{profileEdit && (
										<ProfileModalComponent
											onClose={() => setProfileEdit(false)}
											onUpdate={updateProfile}
											profile={currentUser}
										/>
									)}
								</div>
							)}
						</div>
						<div className='flex justify-center items-center absolute rounded-full bg-[var(--background)] z-10 top-12 w-[120px] h-[120px]'>
							<div
								style={{
									backgroundImage: `url(${
										currentUser.avatar
											? currentUser.avatar
											: `https://ui-avatars.com/api/?name=${currentUser.username.trim()}`
									})`,
								}}
								className='bg-center rounded-full w-[100px] h-[100px] bg-no-repeat bg-contain'
							></div>
						</div>
					</div>
					<div
						className={`flex px-8 justify-center w-full h-24 ${titilium.className}`}
					>
						<div className='flex text-center items-center gap-1 text-3xl mt-16'>
							{currentUser.username}
							{currentUser.status == 'admin' ? (
								<RiVipCrownLine className='text-[var(--gold)]' size={'28px'} />
							) : (
								''
							)}
							{owner && (
								<VscSignOut
									onClick={() => signOut()}
									size={'28px'}
									className='text-red-500 cursor-pointer'
								/>
							)}
						</div>
					</div>
					<p className='w-1/3 text-center text-[--searchbar-text]'>
						{currentUser.description
							? currentUser.description
							: 'No description'}
					</p>
					<div
						className={`flex gap-3 pb-12 justify-center w-full h-full ${outfit.className}`}
					>
						<div className='flex-col text-2xl justify-center text-center items-center w-1/3'>
							<div className='flex w-full gap-2 justify-center items-center'>
								<TbSquareRoundedLetterPFilled size={'30px'} />
								<p>Products</p>
							</div>
							<div className='w-full gap-3 mt-6 grid grid-cols-2 grid-flow-row'></div>
						</div>
						<div className='vl !w-[1px] h-full mt-2'></div>
						<div className='flex-col text-2xl justify-center items-center text-center w-1/3'>
							<div className='flex w-full gap-2 justify-center items-center'>
								<TbSquareRoundedLetterO size={'30px'} />
								<p>Orders</p>
							</div>
							<div className='flex flex-col mt-6'></div>
						</div>
					</div>
				</div>
			) : (
				<div className='flex flex-col w-screen h-screen justify-center items-center'>
					<FaUserSlash size='100px' />
					<p className='text-3xl font-bold mt-3'>User not found</p>
				</div>
			)}
		</div>
	)
}

export default ProfilePage
