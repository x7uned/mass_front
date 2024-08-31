'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa6'
import * as yup from 'yup'

const schema = yup.object().shape({
	username: yup.string().min(3, 'Min 3 symbols').required('Email is required'),
	password: yup
		.string()
		.min(6, 'Min 6 symbols')
		.required('Password is required'),
})

export interface SignInInterface {
	username: string
	password: string
}

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const onSubmit = async (data: SignInInterface) => {
		try {
			const { username, password } = data

			const result = await signIn('credentials', {
				redirect: false,
				username,
				password,
			})

			if (result?.error) {
				if (result?.error === 'Configuration') {
					setError('Login or password is invalid')
				} else {
					setError('Something went wrong')
				}
			}

			if (!result?.error) {
				router.push('/')
			}
		} catch (error) {
			console.error('Sign up failed:', error)
		}
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	})

	return (
		<div className='flex w-1/2'>
			<form className='flex-col w-full' onSubmit={handleSubmit(onSubmit)}>
				<div className='relative'>
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
				<div className='relative'>
					<label htmlFor='password'>Password:</label>
					<input
						id='password'
						type={showPassword ? 'text' : 'password'}
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
					{<span>{error}</span>}
				</div>
				<div className='flex w-full justify-between mt-2'>
					<p className='text-gray-400'>Dont have an account?</p>
					<Link href='/signup'>
						<p className='ml-2'>Sign up</p>
					</Link>
				</div>
				<button
					className='bg-[var(--third)] w-full py-2 rounded-md mt-3'
					type='submit'
				>
					Sign in
				</button>
			</form>
		</div>
	)
}

export default LoginForm
