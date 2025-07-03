'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Home,
  Phone,
  User,
  Building,
  Key,
  DollarSign,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { logout } from '@/service/auth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const { user, isLoading, setUser } = useUser();

  console.log('User:', user);

  const placeholderTexts = [
    "Search luxury apartments...",
    "Find your dream home...",
    "Explore commercial spaces...",
    "Discover new properties...",
    "Search by location...",
    "Find rental properties..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    console.log('Searching:', searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Searching:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsMenuOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const getDashboardUrl = (role: string): string => {
    switch (role) {
      case 'superadmin':
        return '/superAdmin/Manage Admins';
      case 'admin':
        return '/admin/dashboard';
      case 'seller':
        return '/seller/dashboard';
      case 'buyer':
        return '/buyer/properties';
      default:
        return '/';
    }
  };

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Buy', href: '/buy', icon: Key },
    { name: 'Rent', href: '/rent', icon: DollarSign },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  if (isLoading) {
    return (
      <div className="bg-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="text-blue-600 animate-pulse" />
            <span className="font-bold text-xl">RealEstate Pro</span>
          </div>
          <div className="animate-pulse w-24 h-6 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Home className="h-6 w-6 text-white animate-pulse" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RealEstate Pro
                </span>
              </Link>
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={placeholderTexts[placeholderIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium group"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user?.role ? (
                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    href={getDashboardUrl(user.role)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 group"
                  >
                    <LayoutDashboard className="h-4 w-4 group-hover:animate-pulse" />
                    <span className="capitalize">{user.role} Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600 transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && <Icon className="inline-block h-5 w-5 mr-2" />}
                    {item.name}
                  </Link>
                );
              })}

              {user?.role ? (
                <>
                  <Link
                    href={getDashboardUrl(user.role)}
                    className="block px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="inline-block h-5 w-5 mr-2" />
                    {user.role} Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition rounded"
                  >
                    <LogOut className="inline-block h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="inline-block h-5 w-5 mr-2" />
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
