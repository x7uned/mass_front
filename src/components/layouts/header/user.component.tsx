import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PiSignInLight } from 'react-icons/pi'
import { TbUserHexagon } from 'react-icons/tb'

const UserComponent = ({ menu, page }: { menu: boolean; page: string }) => {
	const session = useSession()

	if (!session.data) {
		return (
			<Link href='/signin'>
				<div
					className={`flex ${
						menu
							? `w-36 ${page.includes('/signin') ? 'bg-gradient' : ''} gap-2`
							: `w-12 ${page.includes('/signin') ? 'bg-center-gradient' : ''}`
					} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
				>
					<PiSignInLight size={'24px'} />
					<p>{menu ? 'SignIn' : ''}</p>
				</div>
			</Link>
		)
	}

	return (
		<Link href={`/user/${session.data.user.id}`}>
			<div
				className={`flex ${
					menu
						? `w-36 ${
								page.includes('/signin') ||
								page.includes(`/user/${session.data.user.id}`)
									? 'bg-gradient'
									: ''
						  } gap-2`
						: `w-12 ${
								page.includes('/signin') ||
								page.includes(`/user/${session.data.user.id}`)
									? 'bg-center-gradient'
									: ''
						  }`
				} transition-all glassmorphism overflow-hidden duration-150 h-12 justify-center items-center rounded-xl`}
			>
				{session.data.user.avatar ? (
					<div
						className='w-8 h-8 bg-center bg-no-repeat bg-cover rounded-xl'
						style={{ backgroundImage: `url(${session.data.user.avatar})` }}
					></div>
				) : (
					<TbUserHexagon size={'32px'} />
				)}
				{menu && (
					<>
						<p onClick={() => console.log(session)}>
							{session.data.user.username}
						</p>
					</>
				)}
			</div>
		</Link>
	)
}

export default UserComponent
