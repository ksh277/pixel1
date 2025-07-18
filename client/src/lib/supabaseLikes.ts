import { supabase } from './supabase'
import type { Like } from './supabase'

// 좋아요 추가 함수
export async function likeItem(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<Like | null> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        target_type: targetType,
        target_id: targetId
      })
      .select()
      .single()

    if (error) {
      // 중복 좋아요인 경우 (unique constraint 위반)
      if (error.code === '23505') {
        console.log('이미 좋아요를 누른 항목입니다.')
        return null
      }
      console.error('좋아요 추가 실패:', error)
      return null
    }

    console.log('좋아요 추가 성공:', data)
    return data
  } catch (error) {
    console.error('좋아요 추가 중 오류 발생:', error)
    return null
  }
}

// 좋아요 취소 함수
export async function unlikeItem(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)

    if (error) {
      console.error('좋아요 취소 실패:', error)
      return false
    }

    console.log('좋아요 취소 성공')
    return true
  } catch (error) {
    console.error('좋아요 취소 중 오류 발생:', error)
    return false
  }
}

// 좋아요 토글 함수 (좋아요 상태에 따라 추가/삭제)
export async function toggleLike(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
  try {
    // 현재 좋아요 상태 확인
    const { data: existingLike, error: fetchError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('좋아요 상태 확인 실패:', fetchError)
      return false
    }

    // 좋아요가 이미 있으면 삭제, 없으면 추가
    if (existingLike) {
      return await unlikeItem(userId, targetType, targetId)
    } else {
      const result = await likeItem(userId, targetType, targetId)
      return result !== null
    }
  } catch (error) {
    console.error('좋아요 토글 중 오류 발생:', error)
    return false
  }
}

// 좋아요 상태 확인 함수
export async function checkLikeStatus(userId: string, targetType: 'post' | 'comment', targetId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('좋아요 상태 확인 실패:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('좋아요 상태 확인 중 오류 발생:', error)
    return false
  }
}

// 좋아요 수 조회 함수
export async function getLikeCount(targetType: 'post' | 'comment', targetId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', targetType)
      .eq('target_id', targetId)

    if (error) {
      console.error('좋아요 수 조회 실패:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('좋아요 수 조회 중 오류 발생:', error)
    return 0
  }
}

// 사용자의 좋아요 목록 조회 함수
export async function getUserLikes(userId: string, targetType?: 'post' | 'comment'): Promise<Like[]> {
  try {
    let query = supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (targetType) {
      query = query.eq('target_type', targetType)
    }

    const { data, error } = await query

    if (error) {
      console.error('사용자 좋아요 목록 조회 실패:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('사용자 좋아요 목록 조회 중 오류 발생:', error)
    return []
  }
}