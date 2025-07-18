import { supabase } from './supabase'

export type BucketName = 'custom-designs' | 'post-images' | 'product-images'

// 파일 업로드 함수
export async function uploadFile(
  bucketName: BucketName,
  file: File,
  fileName?: string
): Promise<{ url: string; path: string } | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('파일 업로드 실패:', error)
      return null
    }

    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(finalFileName)

    console.log('파일 업로드 성공:', publicUrl)
    return {
      url: publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('파일 업로드 중 오류 발생:', error)
    return null
  }
}

// 파일 삭제 함수
export async function deleteFile(bucketName: BucketName, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      console.error('파일 삭제 실패:', error)
      return false
    }

    console.log('파일 삭제 성공:', filePath)
    return true
  } catch (error) {
    console.error('파일 삭제 중 오류 발생:', error)
    return false
  }
}

// 다중 파일 업로드 함수
export async function uploadMultipleFiles(
  bucketName: BucketName,
  files: File[]
): Promise<{ url: string; path: string }[]> {
  const uploadPromises = files.map(file => uploadFile(bucketName, file))
  const results = await Promise.all(uploadPromises)
  
  return results.filter(result => result !== null) as { url: string; path: string }[]
}

// 파일 URL 가져오기 함수
export function getFileUrl(bucketName: BucketName, filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)
  
  return publicUrl
}

// 파일 크기 제한 체크 함수
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// 파일 타입 체크 함수
export function validateFileType(file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']): boolean {
  return allowedTypes.includes(file.type)
}

// 파일 업로드 전 검증 함수
export function validateFile(file: File, maxSizeMB: number = 10): { isValid: boolean; error?: string } {
  if (!validateFileType(file)) {
    return { isValid: false, error: '지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 허용)' }
  }
  
  if (!validateFileSize(file, maxSizeMB)) {
    return { isValid: false, error: `파일 크기가 ${maxSizeMB}MB를 초과합니다.` }
  }
  
  return { isValid: true }
}

// 이미지 리사이징 함수 (선택사항)
export function resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      
      // 비율 계산
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      const newWidth = width * ratio
      const newHeight = height * ratio
      
      canvas.width = newWidth
      canvas.height = newHeight
      
      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(resizedFile)
        } else {
          resolve(file)
        }
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// 사용 예시:
/*
// 단일 파일 업로드
const file = document.getElementById('fileInput').files[0]
const result = await uploadFile('custom-designs', file)
if (result) {
  console.log('업로드된 파일 URL:', result.url)
}

// 다중 파일 업로드
const files = Array.from(document.getElementById('fileInput').files)
const results = await uploadMultipleFiles('post-images', files)
console.log('업로드된 파일들:', results)

// 파일 삭제
await deleteFile('custom-designs', 'path/to/file.jpg')
*/