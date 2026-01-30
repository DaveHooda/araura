'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

type Mode = 'login' | 'signup'

interface AuthFormProps {
  mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword(values)
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
      return
    }

    // Signup flow
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { display_name: values.email.split('@')[0] },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email to confirm and sign in.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:border-green-500 focus:outline-none"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-green-400">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white py-2 font-medium transition-colors disabled:opacity-60"
      >
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  )
}
