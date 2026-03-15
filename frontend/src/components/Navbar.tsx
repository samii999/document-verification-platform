'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-800">
            DocVerify
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">Dashboard</Link>
                <Link href="/upload" className="text-gray-600 hover:text-gray-800">Upload</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-purple-600 hover:text-purple-800 font-medium">Admin</Link>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
