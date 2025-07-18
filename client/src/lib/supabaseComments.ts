import { supabase } from './supabase'
import type { Comment } from './supabase'

// 댓글 저장 함수
export async function submitComment(postId: string, userId: string, content: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content,
        like_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('댓글 저장 실패:', error)
      return null
    }

    console.log('댓글 저장 성공:', data)
    return data
  } catch (error) {
    console.error('댓글 저장 중 오류 발생:', error)
    return null
  }
}

// 댓글 목록 조회 함수
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('댓글 조회 실패:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('댓글 조회 중 오류 발생:', error)
    return []
  }
}

// 댓글 수정 함수
export async function updateComment(commentId: string, content: string): Promise<Comment | null> {
  try {
    const { data, error } = await supabase
      .from('community_comments')
      .update({
        content: content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single()

    if (error) {
      console.error('댓글 수정 실패:', error)
      return null
    }

    console.log('댓글 수정 성공:', data)
    return data
  } catch (error) {
    console.error('댓글 수정 중 오류 발생:', error)
    return null
  }
}

// 댓글 삭제 함수
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('댓글 삭제 실패:', error)
      return false
    }

    console.log('댓글 삭제 성공')
    return true
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error)
    return false
  }
}

// 댓글 좋아요 토글 함수
export async function toggleCommentLike(commentId: string): Promise<boolean> {
  try {
    // 현재 댓글 정보 조회
    const { data: currentComment, error: fetchError } = await supabase
      .from('community_comments')
      .select('like_count')
      .eq('id', commentId)
      .single()

    if (fetchError) {
      console.error('댓글 정보 조회 실패:', fetchError)
      return false
    }

    // 좋아요 수 증가
    const { error: updateError } = await supabase
      .from('community_comments')
      .update({
        like_count: (currentComment.like_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)

    if (updateError) {
      console.error('댓글 좋아요 업데이트 실패:', updateError)
      return false
    }

    console.log('댓글 좋아요 토글 성공')
    return true
  } catch (error) {
    console.error('댓글 좋아요 토글 중 오류 발생:', error)
    return false
  }
}

// 댓글 카운트 조회 함수
export async function getCommentCountByPostId(postId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    if (error) {
      console.error('댓글 카운트 조회 실패:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('댓글 카운트 조회 중 오류 발생:', error)
    return 0
  }
}