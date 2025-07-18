import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: User | null, error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ user: User | null, error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: any) => Promise<{ error: AuthError | null }>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function useSupabaseAuth() {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseProvider')
  }
  return context
}

interface SupabaseProviderProps {
  children: React.ReactNode
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((err) => {
      console.error('Failed to get session:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          toast({
            title: "로그인 성공",
            description: "환영합니다!",
          })
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "로그아웃",
            description: "안전하게 로그아웃되었습니다.",
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [toast])

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        toast({
          title: "회원가입 실패",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "회원가입 성공",
          description: "이메일을 확인해주세요.",
        })
      }

      return { user: data.user, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        toast({
          title: "로그인 실패",
          description: error.message,
          variant: "destructive",
        })
      }

      return { user: data.user, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast({
          title: "로그아웃 실패",
          description: error.message,
          variant: "destructive",
        })
      }

      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        toast({
          title: "비밀번호 재설정 실패",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "비밀번호 재설정 이메일 발송",
          description: "이메일을 확인해주세요.",
        })
      }

      return { error }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error: error as AuthError }
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        toast({
          title: "프로필 업데이트 실패",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "프로필 업데이트 성공",
          description: "프로필이 성공적으로 업데이트되었습니다.",
        })
      }

      return { error }
    } catch (error) {
      console.error('Profile update error:', error)
      return { error: error as AuthError }
    }
  }

  const value: SupabaseContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}