import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadPostImage } from '@/lib/supabaseApi'
import { useToast } from '@/hooks/use-toast'

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadProgress(0)
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + 10
          })
        }, 100)

        const imageUrl = await uploadPostImage(file)
        
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 1000)
        
        return imageUrl
      } catch (error) {
        setUploadProgress(0)
        throw error
      }
    },
    onSuccess: () => {
      toast({
        title: '성공',
        description: '이미지가 업로드되었습니다.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: '업로드 실패',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return '이미지 파일만 업로드할 수 있습니다.'
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return '파일 크기는 5MB 이하여야 합니다.'
    }

    return null
  }

  const uploadImage = async (file: File): Promise<string> => {
    const validationError = validateFile(file)
    if (validationError) {
      throw new Error(validationError)
    }

    return uploadMutation.mutateAsync(file)
  }

  return {
    uploadImage,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    validateFile,
  }
}