import { redirect } from 'next/navigation'

export const SignInPage = async () => {
  redirect('/api/auth/signin')
}

export default SignInPage
