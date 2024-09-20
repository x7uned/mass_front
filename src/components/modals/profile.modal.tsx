'use client'

import { Profile } from '@/app/user/[id]/page'
import { useAppDispatch } from '@/redux/store'
import React, { useState } from 'react'
import { MdAddPhotoAlternate } from 'react-icons/md'

interface ModalProps {
	onClose: () => void
	onUpdate: () => void
	profile: Profile
}

const ProfileModalComponent: React.FC<ModalProps> = ({
	onClose,
	profile,
	onUpdate,
}) => {
	const dispatch = useAppDispatch()
	const [currentProfile, setCurrentProfile] = useState<Profile>(profile)
	const [fileErrorMessage, setFileErrorMessage] = useState('')

	const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	const onSubmit = async () => {
		// try {
		// 	const fetchData = {
		// 		avatar: currentProfile.avatar || '',
		// 		description: currentProfile.description || '',
		// 		username: currentProfile.username,
		// 		banner: currentProfile.banner || '',
		// 	}
		// 	const response = await dispatch(fetchEditProfile(fetchData))

		// 	if (response.payload.success == true) {
		// 		onUpdate()
		// 	} else {
		// 		console.log(response)
		// 	}
		// } catch (error) {
		// 	setFileErrorMessage('Something went wrong')
		// 	console.error(error)
		// }
		console.log('sus')
	}

	return (
		<div
			className='z-20 bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black'
			onClick={handleBackgroundClick}
		>
			<div className='dark:bg-custom-gradient h-96 bg-white gap-2 text-center border-[#ffffff22] border w-[500px] flex overflow-hidden flex-col items-center justify-start rounded-xl shadow-lg'>
				<div className='flex w-full items-center flex-col'>
					<div className='flex h-54 w-full justify-center'>
						<div
							style={{
								backgroundImage: `url(https://i.pinimg.com/564x/f6/41/90/f641905331279ff587d837a6e1d366c5.jpg)`,
							}}
							className='flex w-full justify-end bg-no-repeat bg-cover bg-center h-[120px]'
							onClick={() =>
								document.getElementById('file-input-banner')?.click()
							}
						>
							<input
								type='file'
								accept='image/*'
								id='file-input-banner'
								className='hidden'
							/>
							<div className='flex justify-center items-center w-full h-full bg-black bg-opacity-35 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer'>
								<MdAddPhotoAlternate color='white' size={'50px'} />
							</div>
						</div>
						<div className='flex justify-center items-center absolute rounded-full bg-[var(--background-color)] cursor-pointer mt-12 w-[120px] h-[120px]'>
							<div
								style={{
									backgroundImage: `url(${
										currentProfile.avatar
											? currentProfile.avatar
											: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1024px-Missing_avatar.svg.png'
									})`,
								}}
								className='bg-center rounded-full w-[100px] h-[100px] bg-no-repeat bg-contain cursor-pointer overflow-hidden'
								onClick={() => document.getElementById('file-input')?.click()}
							>
								<div className='flex justify-center items-center w-full h-full bg-black bg-opacity-35 opacity-0 hover:opacity-100 transition-opacity duration-300'>
									<MdAddPhotoAlternate color='white' size={'50px'} />
								</div>
								<input
									type='file'
									accept='image/*'
									id='file-input'
									className='hidden'
								/>
							</div>
						</div>
					</div>
					<input
						className='mt-12 text-3xl border-b-2 outline-none text-center'
						type='text'
						value={currentProfile.username}
						onChange={e =>
							setCurrentProfile(prevProfile => ({
								...prevProfile,
								username: e.target.value,
							}))
						}
					/>
					<textarea
						className='w-1/3 mt-4 text-center text-[--searchbar-text] border-2 rounded-md outline-none'
						value={currentProfile.description || ''}
						onChange={e =>
							setCurrentProfile(prevProfile => ({
								...prevProfile,
								description: e.target.value,
							}))
						}
						placeholder='Enter a description'
					/>
					<button onClick={() => onSubmit()} className='fillButton w-3/4 mt-6'>
						Save
					</button>
				</div>
				{fileErrorMessage && (
					<span className='text-red-500'>{fileErrorMessage}</span>
				)}
			</div>
		</div>
	)
}

export default ProfileModalComponent
