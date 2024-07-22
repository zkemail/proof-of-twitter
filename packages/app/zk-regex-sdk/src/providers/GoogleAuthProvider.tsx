'use client';
import { useEffect, useState, ReactNode } from 'react'
import {
  hasGrantedAllScopesGoogle,
  useGoogleLogin,
  googleLogout,
  UseGoogleLoginOptionsImplicitFlow,
} from '@react-oauth/google';

// import useAccount from '@hooks/useAccount';
import { fetchProfile } from '../hooks/useGmailClient';
import GoogleAuthContext from '../contexts/GoogleAuth'

interface ProvidersProps {
  children: ReactNode;
}

const GoogleAuthProvider = ({ children }: ProvidersProps) => {


  /*
   * State Keys
   */

  const getGoogleAuthTokenKey = () => {
    return `googleAuthToken`;
  }

  /*
   * State
   */

  const [googleAuthToken, setGoogleAuthToken] = useState<any | null>(
    () => {
      const cachedToken = localStorage.getItem(getGoogleAuthTokenKey());
      return cachedToken ? JSON.parse(cachedToken) : null;
    }
  );

  const [isGoogleAuthed, setIsGoogleAuthed] = useState<boolean>(false);
  const [isScopesApproved, setIsScopesApproved] = useState<boolean>(false);
  const [loggedInGmail, setLoggedInGmail] = useState<string | null>(null);

  useEffect(() => {
    // console.log('googleAuthScopes_1 TEST');
    // console.log('checking googleAuthToken', googleAuthToken);

    if (googleAuthToken) {
      // console.log('googleAuthScopes_2');

      const allScope = hasGrantedAllScopesGoogle(
        googleAuthToken,
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      );
      
      setIsScopesApproved(allScope);
    }
  }, [googleAuthToken]);

  useEffect(() => {
    // console.log('googleProfile_1');
    // console.log('checking googleAuthToken', googleAuthToken);

    if (googleAuthToken) {
      // console.log('googleProfile_2');

      const fetchData = async () => {
        try {
          const email = await fetchProfile(googleAuthToken.access_token);

          if (email) {
            setLoggedInGmail(email);
            setIsGoogleAuthed(true);
            localStorage.setItem('loggedInEmail', email);
          }
        } catch (error) {
          console.error('Error in fetching profile data:', error);
        }
      };
    
      fetchData();
    };
  }, [googleAuthToken]);

  /*
   * Helpers
   */

  const googleLogIn = useGoogleLogin({
    onSuccess: tokenResponse => {
      setGoogleAuthToken(tokenResponse);
      setIsGoogleAuthed(true);

      localStorage.setItem(getGoogleAuthTokenKey(), JSON.stringify(tokenResponse));
    },
    onError: error => {
      console.error('Error logging in:', error);
    },
    scope: 'email profile https://www.googleapis.com/auth/gmail.readonly',
    flow: 'implicit',
    ux_mode: 'redirect',
  } as UseGoogleLoginOptionsImplicitFlow);

  const googleLogOut = () => {
    setIsScopesApproved(false);

    setGoogleAuthToken(null);
    localStorage.removeItem(getGoogleAuthTokenKey());
  
    setIsGoogleAuthed(false);
    localStorage.removeItem('isGoogleAuthed');
  
    setLoggedInGmail(null);
    localStorage.removeItem('loggedInGmail');
  
    googleLogout();
  };

  return (
      <GoogleAuthContext.Provider
        value={{
          googleAuthToken,
          isGoogleAuthed,
          loggedInGmail,
          scopesApproved: isScopesApproved,
          googleLogIn,
          googleLogOut,
        }}
      >
        {children}
      </GoogleAuthContext.Provider>
  );
};

export default GoogleAuthProvider