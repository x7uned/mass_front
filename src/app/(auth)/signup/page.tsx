import RegisterForm from '@/components/forms/register.form'

const RegisterPage = () => {
	return (
		<div className='flex h-screen w-full'>
			<div className='flex flex-col gap-6 justify-center items-center w-1/2'>
				<p className='text-3xl font-bold'>Sign Up</p>
				<RegisterForm />
			</div>
			<div className='flex w-1/2 bg-center bg-cover bg-no-repeat  bg-dark-login-bg'></div>
		</div>
	)
}
export default RegisterPage
