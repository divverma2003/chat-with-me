import React from "react";
import { MessageCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8 max-w-md">
        {/* Header with Logo */}
        <div className="mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="size-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Chat With Me</h1>
          </div>
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
          <p className="text-lg text-base-content/80 mb-2">
            We couldn't find what you were looking for...
          </p>
          <p className="text-lg text-base-content/80 mb-6">
            Unless you were looking for this page. In that case,{" "}
            <span className="text-primary font-semibold">congrats! 🎉</span>
          </p>
          <p className="text-sm text-base-content/60">
            The page you're trying to reach has gone on an adventure (or never
            existed in the first place).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn btn-primary btn-lg flex items-center gap-2"
          >
            <Home className="size-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg flex items-center gap-2"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
