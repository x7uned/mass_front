'use client'

import { fetchSignUp } from '@/redux/slices/user.slice'
import { useAppDispatch } from '@/redux/store'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import * as yup from 'yup'

const schema = yup.object().shape({
	username: yup.string().min(3, 'Min 3 symbols').required('Name is required'),
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup
		.string()
		.min(6, 'Min 6 symbols')
		.required('Password is required'),
	confirmPassword: yup
		.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm Password is required'),
})

export interface SignUpInterface {
	username: string
	email: string
	password: string
	confirmPassword: string
}

const RegisterForm = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [error, setError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	const onSubmit = async (data: SignUpInterface) => {
		try {
			const params = {
				username: data.username,
				email: data.email,
				password: data.password,
			}

			const fetch = await dispatch(fetchSignUp(params))

			if (fetch.payload.success) {
				router.push('/signin')
			}
		} catch (error) {
			console.error('Sign up failed:', error)
		}
	}

	return (
		<div className='flex w-1/2'>
			<form onSubmit={handleSubmit(onSubmit)} className='w-full'>
				<div>
					<label htmlFor='username'>Username:</label>
					<input
						id='username'
						{...register('username')}
						className='w-full p-2 border rounded'
					/>
					{errors.username && (
						<span className='text-red-400'>{errors.username.message}</span>
					)}
				</div>
				<div>
					<label htmlFor='email'>Email:</label>
					<input
						id='email'
						{...register('email')}
						className='w-full p-2 border rounded'
					/>
					{errors.email && (
						<span className='text-red-400'>{errors.email.message}</span>
					)}
				</div>
				<div className='relative'>
					<label htmlFor='password'>Password:</label>
					<input
						id='password'
						type={showPassword ? 'password' : 'text'}
						{...register('password')}
						className='w-full p-2 border rounded'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-2 top-9'
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
					{errors.password && (
						<span className='text-red-400'>{errors.password.message}</span>
					)}
				</div>
				<div className='relative'>
					<label htmlFor='confirmPassword'>Confirm Password:</label>
					<input
						id='confirmPassword'
						type={showConfirmPassword ? 'password' : 'text'}
						{...register('confirmPassword')}
						className='w-full p-2 border rounded'
					/>
					<button
						type='button'
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className='absolute right-2 top-9'
					>
						{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
					{errors.confirmPassword && (
						<span className='text-red-400'>
							{errors.confirmPassword.message}
						</span>
					)}
				</div>
				<div className='flex w-full justify-between mt-2'>
					<p className='text-gray-400'>Already have an account?</p>
					<Link href='/signin'>
						<p className='ml-1'>Sign in</p>
					</Link>
				</div>
				<button
					className='bg-[var(--third)] w-full py-2 rounded-md mt-2'
					type='submit'
				>
					Sign up
				</button>
			</form>
		</div>
	)
}

export default RegisterForm
