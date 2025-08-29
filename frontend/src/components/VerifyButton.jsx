import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Loader2, RefreshCw } from "lucide-react";

const VerifyButton = (props) => {
  const { resendVerification, isVerifyingEmail } = useAuthStore();

  const [inputEmail, setInputEmail] = useState("");
  const providedEmail = props.email;
  const email = providedEmail || inputEmail;

  const handleResendVerification = async () => {
    if (email) {
      resendVerification(email);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Email input field when no email is provided */}
      {!providedEmail && (
        <div className="w-full max-w-sm">
          <label className="label">
            <span className="label-text text-sm">
              Enter your email to resend verification:
            </span>
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            className="input input-bordered w-full"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleResendVerification}
        disabled={isVerifyingEmail || !email}
        className="btn btn-primary"
      >
        {isVerifyingEmail ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend Verification Email
          </>
        )}
      </button>

      {/* Email display */}
      {email && (
        <div className="text-center">
          <p className="text-sm text-base-content/60 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            Sending to:{" "}
            <span className="font-medium text-base-content/80">{email}</span>
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="text-center max-w-sm">
        <p className="text-xs text-base-content/50">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

export default VerifyButton;
