import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Truck, Package, Clock, MapPin, Edit2, Plus, Copy, ExternalLink, Calendar as CalendarIcon } from 'lucide-react'
import { useSupabaseAuth } from '@/components/SupabaseProvider'
import { useDeliveryTracking, useCreateDeliveryTracking, useUpdateDeliveryTracking, getDeliveryStatusColor, getDeliveryStatusText, getDeliveryStatusIcon } from '@/hooks/useDeliveryTracking'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DeliveryTrackingProps {
  orderId: string
  orderAmount?: number
  showAdminActions?: boolean
}

const DeliveryTrackingForm = ({ 
  orderId, 
  existingTracking, 
  onClose 
}: { 
  orderId: string; 
  existingTracking?: any; 
  onClose: () => void 
}) => {
  const [courier, setCourier] = useState(existingTracking?.courier || '')
  const [trackingNumber, setTrackingNumber] = useState(existingTracking?.tracking_number || '')
  const [status, setStatus] = useState(existingTracking?.status || 'pending')
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | undefined>(
    existingTracking?.estimated_delivery ? new Date(existingTracking.estimated_delivery) : undefined
  )
  
  const createTracking = useCreateDeliveryTracking()
  const updateTracking = useUpdateDeliveryTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (existingTracking) {
        await updateTracking.mutateAsync({
          trackingId: existingTracking.id,
          updates: { 
            courier, 
            tracking_number: trackingNumber, 
            status, 
            estimated_delivery: estimatedDelivery?.toISOString() 
          }
        })
      } else {
        await createTracking.mutateAsync({
          order_id: orderId,
          courier,
          tracking_number: trackingNumber,
          status,
          estimated_delivery: estimatedDelivery?.toISOString()
        })
      }
      onClose()
    } catch (error) {
      console.error('Error submitting delivery tracking:', error)
    }
  }

  return (
    <div className="bg-[#0f172a] text-white p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="courier" className="text-white">택배사</Label>
            <Select value={courier} onValueChange={setCourier}>
              <SelectTrigger className="bg-[#1e2b3c] border-gray-600 text-white">
                <SelectValue placeholder="택배사를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2b3c] border-gray-600">
                <SelectItem value="cj">CJ대한통운</SelectItem>
                <SelectItem value="hanjin">한진택배</SelectItem>
                <SelectItem value="lotte">롯데택배</SelectItem>
                <SelectItem value="logen">로젠택배</SelectItem>
                <SelectItem value="kdexp">경동택배</SelectItem>
                <SelectItem value="cvsnet">편의점택배</SelectItem>
                <SelectItem value="daesin">대신택배</SelectItem>
                <SelectItem value="epost">우체국택배</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="trackingNumber" className="text-white">송장번호</Label>
            <Input
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="송장번호를 입력하세요"
              className="bg-[#1e2b3c] border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status" className="text-white">배송 상태</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-[#1e2b3c] border-gray-600 text-white">
              <SelectValue placeholder="배송 상태를 선택하세요" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e2b3c] border-gray-600">
              <SelectItem value="pending">배송 대기</SelectItem>
              <SelectItem value="processing">배송 준비중</SelectItem>
              <SelectItem value="shipped">배송 시작</SelectItem>
              <SelectItem value="in_transit">배송 중</SelectItem>
              <SelectItem value="out_for_delivery">배송 출발</SelectItem>
              <SelectItem value="delivered">배송 완료</SelectItem>
              <SelectItem value="failed">배송 실패</SelectItem>
              <SelectItem value="returned">반송</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">예상 배송일</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-[#1e2b3c] border-gray-600 text-white hover:bg-gray-700",
                  !estimatedDelivery && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {estimatedDelivery ? format(estimatedDelivery, "PPP", { locale: ko }) : "날짜를 선택하세요"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#1e2b3c] border-gray-600">
              <CalendarComponent
                mode="single"
                selected={estimatedDelivery}
                onSelect={setEstimatedDelivery}
                initialFocus
                className="bg-[#1e2b3c] text-white"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button 
            type="submit" 
            disabled={createTracking.isPending || updateTracking.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createTracking.isPending || updateTracking.isPending ? '저장 중...' : existingTracking ? '수정하기' : '등록하기'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  )
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ 
  orderId, 
  orderAmount, 
  showAdminActions = false 
}) => {
  const { user } = useSupabaseAuth()
  const { data: tracking, isLoading, error } = useDeliveryTracking(orderId)
  const [showTrackingForm, setShowTrackingForm] = useState(false)
  const [editingTracking, setEditingTracking] = useState(null)

  const isAdmin = user?.user_metadata?.role === 'admin'

  const copyTrackingNumber = () => {
    if (tracking?.tracking_number) {
      navigator.clipboard.writeText(tracking.tracking_number)
    }
  }

  const openTrackingLink = () => {
    if (tracking?.tracking_number && tracking?.courier) {
      // Simple tracking URL generation - in production, you'd want proper URLs for each courier
      const trackingUrls = {
        cj: `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${tracking.tracking_number}`,
        hanjin: `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&schLang=KR&wblnumText2=${tracking.tracking_number}`,
        lotte: `https://www.lotteglogis.com/home/reservation/tracking/linkView?InvNo=${tracking.tracking_number}`,
        logen: `https://www.ilogen.com/web/personal/trace/${tracking.tracking_number}`,
        kdexp: `https://kdexp.com/service/delivery/delivery_result.aspx?barcode=${tracking.tracking_number}`,
        cvsnet: `https://www.cvsnet.co.kr/invoice/tracking.do?invoice_no=${tracking.tracking_number}`,
        daesin: `https://www.daesinlogistics.co.kr/daesin/jsp/d_freight_chase/d_general_process2.jsp?billno=${tracking.tracking_number}`,
        epost: `https://service.epost.go.kr/trace.RetrieveTrace.comm?sid1=${tracking.tracking_number}`
      }
      
      const url = trackingUrls[tracking.courier as keyof typeof trackingUrls]
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] text-white p-6 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#0f172a] text-white p-6 rounded-lg">
        <p className="text-red-400">배송 정보를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0f172a] text-white rounded-lg">
      <Card className="bg-[#1e2b3c] border-gray-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl text-white flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              배송 추적
            </CardTitle>
            
            {isAdmin && showAdminActions && (
              <div className="flex space-x-2">
                {tracking ? (
                  <Dialog open={showTrackingForm} onOpenChange={setShowTrackingForm}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => setEditingTracking(tracking)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        배송 정보 수정
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-[#1e2b3c] border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">배송 정보 수정</DialogTitle>
                      </DialogHeader>
                      <DeliveryTrackingForm 
                        orderId={orderId}
                        existingTracking={editingTracking}
                        onClose={() => {
                          setShowTrackingForm(false)
                          setEditingTracking(null)
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog open={showTrackingForm} onOpenChange={setShowTrackingForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        배송 정보 등록
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-[#1e2b3c] border-gray-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">배송 정보 등록</DialogTitle>
                      </DialogHeader>
                      <DeliveryTrackingForm 
                        orderId={orderId}
                        onClose={() => setShowTrackingForm(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {tracking ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getDeliveryStatusIcon(tracking.status)}
                </div>
                <div>
                  <Badge className={cn("text-sm", getDeliveryStatusColor(tracking.status))}>
                    {getDeliveryStatusText(tracking.status)}
                  </Badge>
                </div>
              </div>

              {/* Tracking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracking.courier && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Package className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">택배사</span>
                    </div>
                    <p className="text-white font-medium">{tracking.courier}</p>
                  </div>
                )}

                {tracking.tracking_number && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">송장번호</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium">{tracking.tracking_number}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyTrackingNumber}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={openTrackingLink}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Estimated Delivery & Last Updated */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tracking.estimated_delivery && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-400">예상 배송일</span>
                    </div>
                    <p className="text-white font-medium">
                      {format(new Date(tracking.estimated_delivery), "PPP", { locale: ko })}
                    </p>
                  </div>
                )}

                {tracking.last_updated && (
                  <div className="bg-[#0f172a] p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-gray-400">마지막 업데이트</span>
                    </div>
                    <p className="text-white font-medium">
                      {format(new Date(tracking.last_updated), "PPP p", { locale: ko })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 mb-4">
                배송 정보가 등록되지 않았습니다.
              </p>
              {isAdmin && showAdminActions && (
                <Dialog open={showTrackingForm} onOpenChange={setShowTrackingForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      배송 정보 등록
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-[#1e2b3c] border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">배송 정보 등록</DialogTitle>
                    </DialogHeader>
                    <DeliveryTrackingForm 
                      orderId={orderId}
                      onClose={() => setShowTrackingForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeliveryTracking