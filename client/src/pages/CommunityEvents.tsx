import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Gift, Trophy, Star, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CommunityEvents() {
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const transformedEvents = events?.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    status: event.status || "진행중",
    statusColor: event.status === "active" ? "bg-green-500" : "bg-gray-500",
    startDate: event.start_date,
    endDate: event.end_date,
    image: event.image_url || "/api/placeholder/400/300",
    prize: event.prize_info || "상품 정보 없음",
    isHot: true
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">이벤트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-2xl font-bold mb-2">이벤트</h1>
          <p className="text-blue-100">진행 중인 이벤트에 참여하고 멋진 상품을 받아보세요!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className={`absolute top-2 left-2 ${event.statusColor} text-white`}>
                  {event.status}
                </Badge>
                {event.isHot && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                    HOT
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {event.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.startDate} ~ {event.endDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Gift className="w-4 h-4 mr-2" />
                    {event.prize}
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  참여하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {transformedEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              진행 중인 이벤트가 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              새로운 이벤트가 곧 시작될 예정입니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}