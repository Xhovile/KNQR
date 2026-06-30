import React, { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase Compat if not already initialized
const compatApp = firebase.apps.length 
  ? firebase.app() 
  : firebase.initializeApp({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
    });

const compatAuth = compatApp.auth();

interface AuthFormProps {
  onSuccess?: (user: firebase.User) => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    // Get or create FirebaseUI instance
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(compatAuth);

    const uiConfig: firebaseui.auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
          if (onSuccessRef.current && authResult.user) {
            onSuccessRef.current(authResult.user);
          }
          // Return false to handle redirect/routing manually in React
          return false;
        },
        uiShown: () => {
          const loader = document.getElementById("auth-loader");
          if (loader) loader.style.display = "none";
        }
      },
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
      tosUrl: "#",
      privacyPolicyUrl: "#"
    };

    if (containerRef.current) {
      ui.start(containerRef.current, uiConfig);
    }

    return () => {
      ui.reset();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full mx-auto my-12" id="knqr-auth-form-container">
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl text-chocolate mb-2 uppercase tracking-widest">KNQR</h2>
        <p className="text-xs text-chocolate/60 tracking-[0.2em] font-mono uppercase">Bespoke Apparel & Accessories</p>
      </div>
      
      <div id="auth-loader" className="text-center py-6 text-xs font-mono text-chocolate/80 animate-pulse">
        Establishing Secure Session...
      </div>
      
      <div ref={containerRef} id="firebaseui-auth-container" className="w-full" />
      
      <div className="mt-8 border-t border-gray-100 pt-4 w-full text-center">
        <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
          Note: Google sign-in is fully optimized. If registering via email, make sure Email/Password is activated in your project's authentication methods.
        </p>
      </div>
    </div>
  );
}
