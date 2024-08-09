import { Button, Dimmer, Dropdown, Icon, Loader, Message, MessageHeader, Popup } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ClearanceWrapper from '../clearance/clearanceWrapper';
import ManageG2Users from '../admin/manageG2Users';
import { useEffect } from 'react';

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();
  const { loggingIn, user, logout } = userStore;
  const { openModal } = modalStore;

  // Function to handle login
  const handleLogin = () => {
    userStore.signInArmy();
  };

  useEffect(() => {
    userStore.handleGraphRedirect();
  }, [userStore]);

  return (
    <div>

      <div className='right'>
        {user && user.roles.includes('verified') && (
          <Button
            icon
            labelPosition='left'
            basic
            color='black'
            onClick={() => openModal(<ManageG2Users />, 'fullscreen')}
          >
            <Icon name='cog' size='large' />
            MANAGE G2 USERS
          </Button>
        )}

        {!user  && <div />}
        {user && 
        <Popup
          trigger={
            <Button icon labelPosition='left'>
              <Icon name='user' />
              {user?.mail}
            </Button>
          }
          content={
            <Button icon labelPosition='left' onClick={logout}>
              <Icon name='power' color='red' />
              Logout
            </Button>
          }
          on='click'
          position='bottom right'
          openOnTriggerClick
          closeOnDocumentClick
          hideOnScroll
        />
      }
      </div>

      <div className='homePageContainer'>
        <>
        {!user && 
        <>
          <Icon
            name='shield alternate'
            size='massive'
            style={{ color: '#333F50' }}
            circular
          />
          <h1 style={{ fontSize: '3em' }}>G2 CLEARANCE</h1>
          <h2>LOG IN WITH YOUR ARMY CAC</h2>
          </>
        }
        </>

        {!loggingIn &&
          userStore.token &&
          user &&
          user.roles &&
          user.roles.includes('verified') && <ClearanceWrapper />}

        {!loggingIn && user &&
          ( !user.roles || !user.roles.includes('verified')) && (
            <Message negative icon>
              <Icon name='exclamation' />
              <MessageHeader>YOU ARE NOT AUTHORIZED TO USE THIS APPLICATION</MessageHeader>
            </Message>
          )}

        {loggingIn && (
          <Dimmer active>
            <Loader content='Logging In...' size='huge' />
          </Dimmer>
        )}

        {!loggingIn && !user && (
          <Button onClick={handleLogin} basic color='black'>
            <Icon name='sign-in' />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
});
