import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void
  onImageRemove: () => void
  currentImageUrl?: string
  disabled?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImageUrl,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const { uploadImage, isUploading, uploadProgress, validateFile } = useImageUpload()

  const handleFileSelect = async (file: File) => {
    if (disabled) return

    const validationError = validateFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    try {
      const imageUrl = await uploadImage(file)
      onImageUpload(imageUrl)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleRemove = () => {
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={currentImageUrl}
                alt="업로드된 이미지"
                className="w-full max-w-md h-auto rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              업로드된 이미지를 변경하려면 새 이미지를 선택하세요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              
              {isUploading ? (
                <div className="space-y-4">
                  <ImageIcon className="w-12 h-12 mx-auto text-blue-500" />
                  <div className="space-y-2">
                    <p className="text-white">이미지 업로드 중...</p>
                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-sm text-gray-400">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-white">
                      클릭하거나 이미지를 드래그하여 업로드
                    </p>
                    <p className="text-sm text-gray-400">
                      JPG, PNG, GIF 등 (최대 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled || isUploading}
                className="border-gray-600 text-white hover:bg-gray-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                이미지 선택
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ImageUpload