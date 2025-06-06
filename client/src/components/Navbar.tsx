import { Home, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-md mx-auto flex justify-center gap-16 items-center">
        <Link href="/">
          <a className={`flex items-center ${location === '/' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Home className="h-5 w-5" />
            </div>
          </a>
        </Link>
        
        <Link href="/rewards">
          <a className={`flex items-center ${location === '/rewards' ? 'text-blue-600' : 'text-gray-600'}`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${location === '/rewards' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Trophy className="h-5 w-5" />
            </div>
          </a>
        </Link>
      </div>
    </nav>
  );
}
