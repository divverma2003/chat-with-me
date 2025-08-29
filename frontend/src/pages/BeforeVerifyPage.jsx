import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, CheckCircle, ArrowLeft } from "lucide-react";

import VerifyButton from "../components/VerifyButton";
import { useAuthStore } from "../store/useAuthStore";

const BeforeVerifyPage = () => {
  const { authUser } = useAuthStore();
  const email = authUser?.email; // Safely extract email from authUser object

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="size-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Chat With Me</h1>
            <p className="text-base-content/60">Email Verification Required</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="size-16 rounded-full bg-warning/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-warning" />
              </div>
            </div>

            {/* Main Message */}
            <div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                Verify Your Email to Continue
              </h2>
              <p className="text-base-content/70 mb-4">
                To access Chat With Me, you need to verify your email address
                first. Check your inbox for a verification email.
              </p>
            </div>

            {/* Info Card */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-info font-medium text-sm mb-1">
                    What to do:
                  </p>
                  <ul className="text-info/80 text-sm space-y-1">
                    <li>• Check your email inbox (and spam folder)</li>
                    <li>• Click the verification link in the email</li>
                    <li>• Close this window and log in</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resend Section */}
            <div className="border-t border-base-300 pt-6">
              <p className="text-base-content/60 text-sm mb-4">
                Didn't receive the verification email?
              </p>
              <VerifyButton email={email} />
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-base-content/50">
                Need help? Make sure to check your spam folder or try a
                different email address.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link to="/login" className="btn btn-ghost btn-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BeforeVerifyPage;
