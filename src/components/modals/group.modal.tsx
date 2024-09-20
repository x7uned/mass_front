'use client'

import { Poppins } from 'next/font/google'
import React from 'react'
import GroupForm from '../forms/group.form'

interface ModalProps {
	onClose: () => void
	active: boolean
}

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
})

const GroupModal: React.FC<ModalProps> = ({ onClose, active }) => {
	const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<div
			className={`${
				poppins.className
			} z-20 bg-opacity-50 fixed inset-0 flex items-center justify-center bg-black transition-all duration-200 ${
				active ? '' : 'hidden'
			}`}
			onClick={handleBackgroundClick}
		>
			<div className='dark:bg-custom-gradient bg-[var(--background)] gap-2 text-center border-[#ffffff22] border w-[600px] flex overflow-hidden flex-col items-center justify-start rounded-xl shadow-lg'>
				<p className='text-2xl font-medium mt-3'>Create group</p>
				<GroupForm />
			</div>
		</div>
	)
}

export default GroupModal
