import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import VerifyPanel from "../components/VerifyPanel";
const VerifyEmailPage = () => {
  const { verifyEmail, resendVerification, isVerifyingEmail } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    console.log("VerifyEmailPage useEffect triggered:", { token, hasVerified: hasVerifiedRef.current });
    if (token && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true; // Mark as attempted immediately
      console.log("Starting verification process...");
      handleVerification();
    }
  }, [token]);

  const handleVerification = async () => {
    console.log("handleVerification called");
    setVerificationStatus("verifying");
    try {
      // Direct verification without pre-checking user existence
      await verifyEmail(token);
      setVerificationStatus("success");
      // Auto redirect to login after 10 seconds
      setTimeout(() => {
        navigate("/login");
      }, 10000);
    } catch (error) {
      setVerificationStatus("error");
      setErrorMessage(error.response?.data?.message || "Verification failed");
    }
  };

  const renderContent = () => {
    return (
      <VerifyPanel
        verificationStatus={verificationStatus}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        user={user}
      />
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Chat With Me</h1>
            <p className="text-base-content/60">Email Verification</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          {renderContent()}
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

export default VerifyEmailPage;
