import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@core/store/store';
import { logout } from '@features/auth/store/authSlice';
import { Button } from '../ui/Button';

export function MainLayout() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            شام
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/projects" className="hover:text-primary-600">المشاريع</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-primary-600">لوحة التحكم</Link>
                <Link to="/portfolio" className="hover:text-primary-600">محفظتي</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">{user?.firstName}</span>
                <Button size="sm" variant="outline" onClick={() => dispatch(logout())}>
                  تسجيل خروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="outline">دخول</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">تسجيل</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 منصة شام - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
