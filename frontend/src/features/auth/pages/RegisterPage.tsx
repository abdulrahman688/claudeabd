import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { apiClient } from '@core/api/apiClient';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await apiClient.post('/api/v1/auth/register', data);
      toast.success('تم التسجيل بنجاح!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8">إنشاء حساب جديد</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="الاسم الأول" {...register('firstName')} />
          <Input label="اسم العائلة" {...register('lastName')} />
          <Input label="البريد الإلكتروني" type="email" {...register('email')} />
          <Input label="كلمة المرور" type="password" {...register('password')} />
          <select {...register('role')} className="w-full px-4 py-2 border rounded-lg">
            <option value="investor">مستثمر</option>
            <option value="entrepreneur">رائد أعمال</option>
          </select>
          <select {...register('type')} className="w-full px-4 py-2 border rounded-lg">
            <option value="diaspora">مغترب</option>
            <option value="local">محلي</option>
          </select>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            تسجيل
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          لديك حساب؟ <Link to="/login" className="text-primary-600">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
