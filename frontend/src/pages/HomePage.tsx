import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">منصة شام للتمويل الجماعي</h1>
          <p className="text-xl mb-8">ربط رواد الأعمال بالمستثمرين من خلال blockchain</p>
          <div className="space-x-4 space-x-reverse">
            <Link to="/projects">
              <Button size="lg">تصفح المشاريع</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">ابدأ الآن</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
