import LoginForm from '@/components/forms/login.form'

const LoginPage = () => {
	return (
		<div className='flex h-screen w-full'>
			<div className='flex flex-col gap-6 justify-center items-center w-1/2'>
				<p className='text-3xl font-bold'>Sign In</p>
				<LoginForm />
			</div>
			<div className='flex w-1/2 bg-center bg-cover bg-no-repeat  bg-login-bg'></div>
		</div>
	)
}
export default LoginPage
