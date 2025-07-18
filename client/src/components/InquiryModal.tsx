import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { apiRequest } from "@/lib/queryClient";
import type { InsertInquiry } from "@/shared/schema";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    inquiryType: "general" as const,
    message: "",
  });

  const createInquiryMutation = useMutation({
    mutationFn: async (inquiryData: InsertInquiry) => {
      return await apiRequest('/api/inquiries', {
        method: 'POST',
        body: inquiryData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
      toast({
        title: "문의가 등록되었습니다",
        description: "빠른 시일 내에 답변드리겠습니다.",
      });
      onClose();
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        inquiryType: "general",
        message: "",
      });
    },
    onError: (error) => {
      console.error('Failed to create inquiry:', error);
      toast({
        title: "문의 등록 실패",
        description: "다시 시도해주세요.",
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "필수 정보 누락",
        description: "모든 필수 항목을 입력해주세요.",
        variant: 'destructive',
      });
      return;
    }

    const inquiryData: InsertInquiry = {
      userId: user?.id || null,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.subject,
      inquiryType: formData.inquiryType,
      message: formData.message,
      status: "pending",
      priority: "normal",
      attachments: null,
    };

    await createInquiryMutation.mutateAsync(inquiryData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {t({
              ko: "문의하기",
              en: "Contact Us",
              ja: "お問い合わせ",
              zh: "联系我们",
            })}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">
                {t({
                  ko: "이름",
                  en: "Name",
                  ja: "名前",
                  zh: "姓名",
                })} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder={t({
                  ko: "이름을 입력하세요",
                  en: "Enter your name",
                  ja: "名前を入力してください",
                  zh: "请输入您的姓名",
                })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">
                {t({
                  ko: "이메일",
                  en: "Email",
                  ja: "メール",
                  zh: "邮箱",
                })} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={t({
                  ko: "이메일을 입력하세요",
                  en: "Enter your email",
                  ja: "メールを入力してください",
                  zh: "请输入您的邮箱",
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">
                {t({
                  ko: "전화번호",
                  en: "Phone",
                  ja: "電話番号",
                  zh: "电话",
                })}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder={t({
                  ko: "전화번호를 입력하세요",
                  en: "Enter your phone number",
                  ja: "電話番号を入力してください",
                  zh: "请输入您的电话号码",
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="inquiryType">
                {t({
                  ko: "문의 유형",
                  en: "Inquiry Type",
                  ja: "お問い合わせの種類",
                  zh: "咨询类型",
                })}
              </Label>
              <Select value={formData.inquiryType} onValueChange={(value) => handleChange('inquiryType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t({
                    ko: "문의 유형을 선택하세요",
                    en: "Select inquiry type",
                    ja: "お問い合わせの種類を選択",
                    zh: "请选择咨询类型",
                  })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    {t({
                      ko: "일반 문의",
                      en: "General Inquiry",
                      ja: "一般的なお問い合わせ",
                      zh: "一般咨询",
                    })}
                  </SelectItem>
                  <SelectItem value="product">
                    {t({
                      ko: "제품 문의",
                      en: "Product Inquiry",
                      ja: "製品のお問い合わせ",
                      zh: "产品咨询",
                    })}
                  </SelectItem>
                  <SelectItem value="order">
                    {t({
                      ko: "주문 문의",
                      en: "Order Inquiry",
                      ja: "注文のお問い合わせ",
                      zh: "订单咨询",
                    })}
                  </SelectItem>
                  <SelectItem value="technical">
                    {t({
                      ko: "기술 지원",
                      en: "Technical Support",
                      ja: "技術サポート",
                      zh: "技术支持",
                    })}
                  </SelectItem>
                  <SelectItem value="shipping">
                    {t({
                      ko: "배송 문의",
                      en: "Shipping Inquiry",
                      ja: "配送のお問い合わせ",
                      zh: "配送咨询",
                    })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">
              {t({
                ko: "제목",
                en: "Subject",
                ja: "件名",
                zh: "主题",
              })} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder={t({
                ko: "문의 제목을 입력하세요",
                en: "Enter inquiry subject",
                ja: "お問い合わせの件名を入力してください",
                zh: "请输入咨询主题",
              })}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">
              {t({
                ko: "내용",
                en: "Message",
                ja: "内容",
                zh: "内容",
              })} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t({
                ko: "문의 내용을 상세히 입력해주세요",
                en: "Please provide detailed inquiry information",
                ja: "お問い合わせの詳細をご記入ください",
                zh: "请详细输入咨询内容",
              })}
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {t({
                ko: "취소",
                en: "Cancel",
                ja: "キャンセル",
                zh: "取消",
              })}
            </Button>
            <Button
              type="submit"
              disabled={createInquiryMutation.isPending}
            >
              {createInquiryMutation.isPending ? (
                t({
                  ko: "등록 중...",
                  en: "Submitting...",
                  ja: "送信中...",
                  zh: "提交中...",
                })
              ) : (
                t({
                  ko: "문의 등록",
                  en: "Submit Inquiry",
                  ja: "お問い合わせを送信",
                  zh: "提交咨询",
                })
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}