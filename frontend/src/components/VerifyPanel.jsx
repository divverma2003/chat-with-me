import React, { useState } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import VerifyButton from "./VerifyButton";
import { Link } from "react-router-dom";
const VerifyPanel = (props) => {
  return (
    <>
      {props.verificationStatus === "verifying" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Verifying Your Email
            </h2>
            <p className="text-base-content/60">
              Please wait while we confirm your email address...
            </p>
          </div>
        </div>
      )}
      {props.verificationStatus === "success" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-base-content/60 mb-4">
              Your account has been activated. You can now log in to access all
              features.
            </p>
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
              <p className="text-success text-sm">
                {/*TO DO: REALTIME FUNCTIONALITY*/}
                Welcome to Chat With Me! Redirecting to login in 10 seconds...
              </p>
            </div>
            <Link to="/login" className="btn btn-primary btn-wide">
              Continue to Login
            </Link>
          </div>
        </div>
      )}
      {props.verificationStatus === "error" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-error" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Verification Failed. Try Again?
            </h2>
            <p className="text-error mb-4">{props.errorMessage}</p>
            <VerifyButton email={props.user?.email} />
          </div>
        </div>
      )}
    </>
  );
};
export default VerifyPanel;
