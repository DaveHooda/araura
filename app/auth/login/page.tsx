import Link from 'next/link'
import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
        <p className="text-sm text-gray-400 mb-6">
          Access your saved aurora locations.
        </p>

        <AuthForm mode="login" />

        <p className="text-sm text-gray-400 mt-6 text-center">
          Need an account?{' '}
          <Link className="text-green-500 hover:text-green-400" href="/auth/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
