import { redirect } from 'next/navigation'

export const RegisterPage = async () => {
  redirect('/api/auth/register')
}

export default RegisterPage
