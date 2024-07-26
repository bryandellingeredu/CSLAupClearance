import { Login } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { useEffect, useState } from 'react';

function useIsEduSignedIn(): [boolean] {
    const [isSEduignedIn, setIsSEduignedIn] = useState(false);
    useEffect(() => {
      const updateState = () => {
        const provider = Providers.globalProvider;
        setIsSEduignedIn(provider && provider.state === ProviderState.SignedIn);
      };
  
      Providers.onProviderUpdated(updateState);
      updateState();
  
      return () => {
        Providers.removeProviderUpdatedListener(updateState);
      };
    }, []);
    return [isSEduignedIn];
  }

export default function HomePage(){
    const [isEduSignedIn] = useIsEduSignedIn();
    return(
        <div>
        <h1>Home Page</h1>
        <Login  />
        <Login loginView='compact'/>
        </div>
    )
}