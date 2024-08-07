import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Button, Divider, Header, Icon, Segment, SegmentGroup, Popup, Form, FormGroup, FormField, Input, Label, Checkbox } from "semantic-ui-react";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default observer(function ManageG2Users() {
    const { modalStore, userStore } = useStore();
    const {closeModal} = modalStore;
    const { allowedUsers, updateAllowedUser, deleteAllowedUser} = userStore
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [newEmailError, setNewEmailError] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleDeleteClick = (userId : string) => {
      setUserToDelete(userId);
      setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
      if(userToDelete){
      deleteAllowedUser(userToDelete);
      setConfirmOpen(false);
      setUserToDelete(null);
      }
    };

    const handleCancelDelete = () => {
      setConfirmOpen(false);
      setUserToDelete(null);
    };

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return (
        !email ||
        !emailRegex.test(email) ||
        !email.endsWith('army.mil')
      );
    };

    const handleEmailChange =  (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewEmailError(false);
      setNewEmail(event.target.value);
    } 
    
    const handleCheckboxChange = () =>  setIsAdmin(!isAdmin);
    
    const handleSubmit = async () => {
      if (!newEmail) {
        setNewEmailError(true);
        return;
      }

      if (
        allowedUsers
          .map((x) => x.email.toLowerCase())
          .includes(newEmail.toLocaleLowerCase())
      ) {
        setNewEmail('');
        return;
      }
      
      const error = validateEmail(newEmail);
      setNewEmailError(error);
      if (!error) {
        try{
          await updateAllowedUser({id: uuidv4(), email: newEmail.toLocaleLowerCase(), isAdmin})
          setNewEmail('');
          setIsAdmin(false)
        } catch(error : any){
          console.log(error);
        }
      }

    }

  return(
    <>
    <Button
    floated="right"
      icon
      size="mini"
      color="grey"
      compact
      onClick={() => closeModal()}> 
      <Icon name="close" />
    </Button>
    <Divider horizontal>
            <Header as="h1" color='grey'>
              <Icon name="cogs" style={{paddingRight: '5px'}}/>
              MANAGE G2 USERS
            </Header>
    </Divider>

    <SegmentGroup style={{ marginTop: '40px', padding: '20px' }}>
      <Segment textAlign="center" >
        <Header icon color="grey" as="h4">
        <Icon name="user" />
                CURRENT G2 USERS
        </Header>
    </Segment>
    <Segment >
          {allowedUsers.map((user) => (
            <Popup
              key={user.id}
              trigger={
                <Button
                  icon
                  labelPosition="left"
                  basic
                  color="grey"
                  size="large"
                  onClick={() => handleDeleteClick(user.id)}
                >
                  <Icon name="x" color="red" />
                  <span>{user.email}</span>
                  {user.isAdmin && <span>( ADMIN )</span>}
                </Button>
              }
              content={
                <>
                  <p>Are you sure you want to delete this user?</p>
                  <Button color="red" onClick={handleConfirmDelete}>Yes</Button>
                  <Button onClick={handleCancelDelete}>Cancel</Button>
                </>
              }
              on="click"
              open={confirmOpen && userToDelete === user.id}
              position="top center"
            />
          ))}
        </Segment>
        <Segment>
        <Header icon color="grey" textAlign="center" as="h4">
                <Icon name="plus" />
              ADD A NEW G2 USER
              </Header>
              <Form onSubmit={handleSubmit}>
      <FormGroup inline style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <FormField required error={newEmailError} style={{ flex: 1, marginRight: '1em' }}>
          <Input
            icon="envelope"
            iconPosition="left"
            placeholder="Enter an army.mil email"
            value={newEmail}
            onChange={handleEmailChange}
            list="emailOptions"
            fluid
          />
          {newEmailError && (
            <Label basic color="red" pointing="above" style={{ display: 'block' }}>
              Please enter a valid army.mil email address
            </Label>
          )}
        </FormField>
        <FormField style={{ marginRight: '1em' }}>
          <Checkbox
            label="Admin"
            checked={isAdmin}
            onChange={handleCheckboxChange}
          />
        </FormField>
        <FormField>
          <Button type="submit">Submit</Button>
        </FormField>
      </FormGroup>
    </Form>
        </Segment>

    </SegmentGroup>
    </>
  )
})