import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  FileText,
  Send,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Inquiry() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t({ ko: '문의가 접수되었습니다', en: 'Inquiry Submitted', ja: 'お問い合わせを受け付けました', zh: '咨询已提交' }),
      description: t({ ko: '빠른 시일 내에 답변드리겠습니다.', en: 'We will respond as soon as possible.', ja: '早急に回答いたします。', zh: '我们会尽快回复您。' }),
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: '',
      subject: '',
      message: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t({ ko: '문의하기', en: 'Contact Us', ja: 'お問い合わせ', zh: '联系我们' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t({ ko: '궁금한 점이 있으시면 언제든지 문의해 주세요', en: 'Feel free to contact us with any questions', ja: 'ご質問がございましたらお気軽にお問い合わせください', zh: '如有任何疑问，请随时联系我们' })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  {t({ ko: '연락처 정보', en: 'Contact Information', ja: '連絡先情報', zh: '联系信息' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t({ ko: '전화 상담', en: 'Phone Support', ja: '電話サポート', zh: '电话支持' })}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">02-1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t({ ko: '이메일 문의', en: 'Email Inquiry', ja: 'メールでのお問い合わせ', zh: '邮件咨询' })}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">support@allthatprinting.co.kr</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t({ ko: '상담 시간', en: 'Support Hours', ja: 'サポート時間', zh: '支持时间' })}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t({ ko: '평일 09:00 - 18:00', en: 'Weekdays 09:00 - 18:00', ja: '平日 09:00 - 18:00', zh: '工作日 09:00 - 18:00' })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t({ ko: '(토요일, 일요일, 공휴일 휴무)', en: '(Closed on weekends and holidays)', ja: '(土日祝日休み)', zh: '(周末和节假日休息)' })}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {t({ ko: '카카오톡 상담', en: 'KakaoTalk Support', ja: 'カカオトーク相談', zh: 'KakaoTalk咨询' })}
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-yellow-400"
                    onClick={() => window.open('http://pf.kakao.com/_allthatprinting', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t({ ko: '카카오톡 상담하기', en: 'KakaoTalk Chat', ja: 'カカオトーク相談', zh: 'KakaoTalk聊天' })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-white">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  {t({ ko: '문의 양식', en: 'Inquiry Form', ja: 'お問い合わせフォーム', zh: '咨询表单' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center dark:text-white">
                        <User className="h-4 w-4 mr-2" />
                        {t({ ko: '이름', en: 'Name', ja: '名前', zh: '姓名' })} *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder={t({ ko: '성함을 입력해주세요', en: 'Enter your name', ja: 'お名前を入力してください', zh: '请输入您的姓名' })}
                        className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center dark:text-white">
                        <Mail className="h-4 w-4 mr-2" />
                        {t({ ko: '이메일', en: 'Email', ja: 'メール', zh: '邮箱' })} *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder={t({ ko: '이메일을 입력해주세요', en: 'Enter your email', ja: 'メールを入力してください', zh: '请输入您的邮箱' })}
                        className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="dark:text-white">
                        <Phone className="h-4 w-4 mr-2 inline" />
                        {t({ ko: '전화번호', en: 'Phone Number', ja: '電話番号', zh: '电话号码' })}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t({ ko: '전화번호를 입력해주세요', en: 'Enter your phone number', ja: '電話番号を入力してください', zh: '请输入您的电话号码' })}
                        className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="dark:text-white">
                        {t({ ko: '문의 유형', en: 'Inquiry Type', ja: 'お問い合わせ種別', zh: '咨询类型' })} *
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600">
                          <SelectValue placeholder={t({ ko: '문의 유형을 선택해주세요', en: 'Select inquiry type', ja: 'お問い合わせ種別を選択', zh: '请选择咨询类型' })} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">{t({ ko: '제품 문의', en: 'Product Inquiry', ja: '製品のお問い合わせ', zh: '产品咨询' })}</SelectItem>
                          <SelectItem value="order">{t({ ko: '주문 문의', en: 'Order Inquiry', ja: '注文のお問い合わせ', zh: '订单咨询' })}</SelectItem>
                          <SelectItem value="design">{t({ ko: '디자인 문의', en: 'Design Inquiry', ja: 'デザインのお問い合わせ', zh: '设计咨询' })}</SelectItem>
                          <SelectItem value="technical">{t({ ko: '기술 지원', en: 'Technical Support', ja: '技術サポート', zh: '技术支持' })}</SelectItem>
                          <SelectItem value="other">{t({ ko: '기타', en: 'Other', ja: 'その他', zh: '其他' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="dark:text-white">
                      {t({ ko: '제목', en: 'Subject', ja: '件名', zh: '主题' })} *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                      placeholder={t({ ko: '문의 제목을 입력해주세요', en: 'Enter inquiry subject', ja: 'お問い合わせ件名を入力', zh: '请输入咨询主题' })}
                      className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="dark:text-white">
                      {t({ ko: '문의 내용', en: 'Message', ja: 'お問い合わせ内容', zh: '咨询内容' })} *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={6}
                      placeholder={t({ ko: '문의 내용을 자세히 적어주세요', en: 'Please describe your inquiry in detail', ja: 'お問い合わせ内容を詳しく記入してください', zh: '请详细描述您的咨询内容' })}
                      className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white border dark:border-gray-600"
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    {t({ ko: '문의하기', en: 'Send Inquiry', ja: 'お問い合わせ送信', zh: '发送咨询' })}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="inline-flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t({ ko: '뒤로가기', en: 'Go Back', ja: '戻る', zh: '返回' })}
          </Button>
        </div>
      </div>
    </div>
  );
}