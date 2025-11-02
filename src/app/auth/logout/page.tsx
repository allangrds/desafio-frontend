import { redirect } from 'next/navigation'

export const LogoutPage = async () => {
  redirect('/api/auth/logout')
}

export default LogoutPage
