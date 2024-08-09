import { makeAutoObservable, reaction } from "mobx";
import { User } from "../models/user";
import agent from "../api/agent";
import { AllowedUser } from "../models/allowedUser";
import { toast } from "react-toastify";
import { PublicClientApplication } from '@azure/msal-browser';

export default class UserStore {
    user: User | null = null;
    loggingIn: boolean = false;
    token: string | null | undefined = localStorage.getItem('g2jwt');
    appLoaded = false;
    allowedUserRegistry = new Map<string, AllowedUser>();
    loadingInitial = false;

    logoutRequest = {
      postLogoutRedirectUri: '/',
    };
  
    armyMsalConfig = {
      auth: {
        clientId: import.meta.env.VITE_CAC_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_CAC_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_REDIRECT_ARMY_URI,
        navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
      },
    };
  
    loginRequest = {
      scopes: ['User.Read'],
    };
    
    myMSALObj = new PublicClientApplication(this.armyMsalConfig);

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('g2jwt', token);
                } else {
                    localStorage.removeItem('g2jwt');
                }
            }
        )
    }
  
    get isLoggedIn() {
      return !!this.user;
    }

    handleGraphRedirect = async () => {
      const response = await this.myMSALObj.handleRedirectPromise();
      if (response) {
        this.login(response.accessToken);
      }
    };

    signInArmy = async () => {
      try {
        await this.myMSALObj.loginRedirect(this.loginRequest);
      } catch (error) {
        toast.error('Error Logging into Army 365 - please login again', {
          position: 'top-center',
          autoClose: 25000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        sessionStorage.clear();
        localStorage.clear();
        this.setToken(null);
        this.user = null;
      }
    };

    get allowedUsers() {
      return Array.from(this.allowedUserRegistry.values()).sort((a, b) => {
        return a.email.localeCompare(b.email);
      });
    }

    loadAllowedUsers = async () =>{
      this.setLoadingInitial(true);
      try {
        const allowedUsers = await agent.AllowedUsers.list();
        allowedUsers.forEach(user => {
          this.allowedUserRegistry.set(user.id, user);
        })
      } catch (error) {
        console.error(error);
      } finally {
        this.setLoadingInitial(false);
      }
    }

    updateAllowedUser = async (allowedUser : AllowedUser) => {
      this.allowedUserRegistry.set(allowedUser.id, allowedUser);
      try {
        await agent.AllowedUsers.update(allowedUser);
      } catch (error) {
        toast.error('Error Saving to Database', {
          position: 'top-center',
          autoClose: 25000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        console.error(error);
      }
    }

    deleteAllowedUser = async (id : string) =>{
      this.allowedUserRegistry.delete(id);
      try {
        await agent.AllowedUsers.delete(id);
      } catch (error) {
        toast.error('Error Deleting User', {
          position: 'top-center',
          autoClose: 25000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        console.error(error);
      }
    }

    login = async (graphtoken: string) => {
      this.setLoggingIn(true);
      try {
        const user = await agent.Account.login(graphtoken);
        this.setUser(user);
        this.setToken(user.token);
      } catch (error) {
        this.user = null;
        this.setToken(null);
        console.error(error);
      } finally {
        this.setLoggingIn(false);
      }
    };

    getUser = async () => {
      debugger;
      try {
        debugger;
        const user = await agent.Account.current();
        this.setUser(user);
      } catch (error) {
        debugger;
        this.setToken(null);
        this.setUser(null);
      }
    };

    logout = () => {
      this.setToken(null);
      this.setUser(null);
      this.myMSALObj.logoutRedirect(this.logoutRequest);
    }

 

    setLoggingIn = (loggingIn: boolean) => {
        this.loggingIn = loggingIn;
    };

    setToken = (token : string | null) => {
        this.token = token;
    }

    setUser = (user : User | null  ) => {
        this.user = user;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    };
    
    setLoadingInitial = (state : boolean) => {
        this.loadingInitial = state;
    };

}
