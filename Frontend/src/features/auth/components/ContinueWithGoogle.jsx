import React from 'react'

const ContinueWithGoogle = () => {
  return (
    <>
    <a href="/api/auth/google">
              <button type="button"
                className="ghost-btn active:scale-95 transform  transition-transform 
               duration-150 w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg text-xs font-semibold mb-4"
                style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.06em" }}>
                <GoogleIcon />
                Continue with Google
              </button>
            </a>
    </>
  )
}

export default ContinueWithGoogle