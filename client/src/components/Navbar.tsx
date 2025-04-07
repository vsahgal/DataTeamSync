import { Home, Trophy, User, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-4 py-3 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/' ? 'bg-blue-100' : 'bg-gray-100'} mb-1`}>
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Home</span>
          </a>
        </Link>
        
        <Link href="/rewards">
          <a className={`flex flex-col items-center ${location === '/rewards' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/rewards' ? 'bg-blue-100' : 'bg-gray-100'} mb-1`}>
              <Trophy className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Rewards</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`flex flex-col items-center ${location === '/profile' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/profile' ? 'bg-blue-100' : 'bg-gray-100'} mb-1`}>
              <User className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Profile</span>
          </a>
        </Link>
        
        <Link href="/settings">
          <a className={`flex flex-col items-center ${location === '/settings' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/settings' ? 'bg-blue-100' : 'bg-gray-100'} mb-1`}>
              <Settings className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium">Settings</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
