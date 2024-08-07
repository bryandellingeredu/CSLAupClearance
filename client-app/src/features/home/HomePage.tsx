import { Login } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { useEffect, useState } from 'react';
import { Button, Dimmer,  Icon, Loader, Message, MessageHeader, } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ClearanceWrapper from '../clearance/clearanceWrapper';
import ManageG2Users from '../admin/manageG2Users';

function useIsEduSignedIn() {
  const [isEduSignedIn, setIsEduSignedIn] = useState(false);
  const { userStore} = useStore();
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
  const { userStore, modalStore } = useStore();
  const { loggingIn, user } = userStore;
  const { openModal } = modalStore;
  const [isEduSignedIn] = useIsEduSignedIn();

  return (
    <div>
      {isEduSignedIn &&
        <div className='right'>
           {user && user.roles.includes('verified') &&
            <Button icon labelPosition='left' basic color='black'
              onClick={() => openModal(<ManageG2Users/>, 'fullscreen')}
            >
              <Icon name='user' size='large'/>
                MANAGE G2 USERS
            </Button>
          }

          {(!user || !user.roles || !user.roles.includes('verified')) && <div /> }

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

       {!loggingIn && isEduSignedIn && userStore.token && user && user.roles && user.roles.includes('verified') && <ClearanceWrapper />}

       {!loggingIn && isEduSignedIn && (!user || !user.roles || !user.roles.includes('verified') ) &&
         <Message negative icon>
           <Icon name='exclamation'  />
         <MessageHeader>
          YOU ARE NOT AUTHORIZED TO USE THIS APPLICATION
          </MessageHeader>
       </Message>
       }


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