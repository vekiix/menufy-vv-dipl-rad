'use client'

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { DataStatusView } from "@/components/ui/data-status-view";
import { signIn } from "next-auth/react";

const GuestLoginContent = () => {
  const [state, setState] = useState<"error" | "success" | "loading"> ("loading");
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const processGuestLogin = async () => {
      try {
        setState("loading")
        setError(null);

        // Get search parameters
        const uid = searchParams.get('uid');
        const ctr = searchParams.get('ctr');
        const cmac = searchParams.get('cmac');

        // Validate required parameters
        if (!uid || !ctr || !cmac) {
          throw new Error("Missing required guest login parameters");
        }

        // Sign in with NextAuth using the guest provider directly
        const result = await signIn('guest', {
          redirect: true,
          callbackUrl: '/redirect',
          uid,
          ctr,
          cmac,
        });

        if (result?.error) {
          // Decode the error message that was encoded in NextAuth
          const decodedError = decodeURIComponent(result.error);
          throw new Error(decodedError);
        }

        setState("success");
        showToast("Guest login successful!", "success");

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Guest login failed";
        setState("error")
        setError(errorMessage);
        showToast(`Guest login failed: ${errorMessage}`, "error");
      }
    };

    processGuestLogin();
  }, [searchParams, showToast]);

 
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
        
          {state == "loading" && (
            <DataStatusView
              isLoading={true}
              hasData={false}
              loadingTitle="Processing Guest Login"
            loadingMessage="Please wait while we authenticate your guest access..."
          />)
        }
        {
            state == "success" && (
             <p>✅ Redirecting...</p>   
            )
            
        }
        {error && (
            <div className="mt-6 text-center">
            <DataStatusView
            isLoading={false}
            hasData={false}
            errorTitle="Guest Login Failed"
            errorMessage={error} />

            <p>
                Try scanning the NFC chip again. 
            </p>
            </div>
        )}

            
        
        </div>
      </div>
    );
  }

export default function GuestLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
          <DataStatusView
            isLoading={true}
            hasData={false}
            loadingTitle="Loading Guest Login"
            loadingMessage="Please wait while we prepare your guest access..."
          />
        </div>
      </div>
    }>
      <GuestLoginContent />
    </Suspense>
  );
}

