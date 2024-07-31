import { Login } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { useEffect, useState } from 'react';
import { Dimmer,  Icon, Loader, } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ClearanceWrapper from '../clearance/clearanceWrapper';

function useIsEduSignedIn() {
  const [isEduSignedIn, setIsEduSignedIn] = useState(false);
  const { userStore } = useStore();
  const {  login, logout } = userStore;

  useEffect(() => {
    const updateState = async () => {
      const provider = Providers.globalProvider;
      const signedIn = provider && provider.state === ProviderState.SignedIn;
      const signedOut = provider && provider.state === ProviderState.SignedOut;
      setIsEduSignedIn(signedIn);

      if (signedIn) {

        try {
          const accessToken = await provider.getAccessToken();
          await login(accessToken);
        } catch (error) {
          console.error('Error getting access token', error);
        }
      } else if (signedOut){
        logout();
      }
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, [ login]);

  return [isEduSignedIn];
}

export default observer (function HomePage() {
  const { userStore } = useStore();
  const { loggingIn } = userStore;
  const [isEduSignedIn] = useIsEduSignedIn();

  return (
    <div>
      {isEduSignedIn &&
        <div className='right'>
          <Login />
        </div>
      }
      
     
      <div className='homePageContainer'>
        {!isEduSignedIn && 
        <>
        <Icon name='shield alternate' size='massive' style={{ color: '#333F50' }} circular></Icon>
        <h1 style={{ fontSize: '3em' }}>G2 CLEARANCE</h1>
        <h2>LOG IN WITH YOUR ARMY CAC</h2>
        </>
       }
       {isEduSignedIn && userStore.token && <ClearanceWrapper />}

        {loggingIn &&
          <Dimmer active>
            <Loader content='Logging In...' size='huge' />
          </Dimmer>
        }

        {!isEduSignedIn && !loggingIn &&
          <Login />
        }
      </div>
    </div>
  );
})