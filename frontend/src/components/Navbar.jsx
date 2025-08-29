import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import {
  LogOut,
  MessageCircle,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { getTotalUnreadCount } = useChatStore();
  const totalUnread = getTotalUnreadCount();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chat With Me</h1>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Message Count - integrated with other nav items */}
            <div className="relative">
              <button className="btn btn-sm gap-2 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
                {totalUnread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full size-5 flex items-center justify-center font-medium">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </div>
                )}
              </button>
            </div>

            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
