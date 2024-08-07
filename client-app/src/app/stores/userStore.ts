import { makeAutoObservable, reaction } from "mobx";
import { User } from "../models/user";
import agent from "../api/agent";
import { AllowedUser } from "../models/allowedUser";
import { toast } from "react-toastify";

export default class UserStore {
    user: User | null = null;
    loggingIn: boolean = false;
    token: string | null | undefined = localStorage.getItem('g2jwt');
    appLoaded = false;
    allowedUserRegistry = new Map<string, AllowedUser>();
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.token,
            token => {
                if (token){
                    localStorage.setItem('g2jwt', token);
                } else {
                    localStorage.removeItem('g2jwt');
                }
            }
        )
    }

    get allowedUsers() {
      return Array.from(this.allowedUserRegistry.values()).sort((a, b) => {
        if (a.email < b.email) return -1;
        if (a.email > b.email) return 1;
        return 0;
      });
    }

    loadAllowedUsers = async () =>{
      this.setLoadingInitial(true);
   try{
      const allowedUsers = await agent.AllowedUsers.list();
      allowedUsers.forEach(user => {
          this.allowedUserRegistry.set(user.id, user);
      })
      this.setLoadingInitial(false);
   } catch(error) {
    console.log(error);
    this.setLoadingInitial(false);
   }
  }

  updateAllowedUser = async (allowedUser : AllowedUser) => {
    this.allowedUserRegistry.set(allowedUser.id, allowedUser);
    try{
     await agent.AllowedUsers.update(allowedUser)
    }catch(error) {
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
    console.log(error);
   }

  }

  deleteAllowedUser = async (id : string) =>{
    this.allowedUserRegistry.delete(id);
    try{
      await agent.AllowedUsers.delete(id)
    }catch(error) {
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
         console.log(error);
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
          this.setToken(null)
          console.log(error);
        } finally {
            this.setLoggingIn(false);
        }
      };

      getUser = async () => {
        try {
          const user = await agent.Account.current();
          this.setUser(user);
        } catch (error) {
          this.setToken(null);
          this.setUser(null);
        }
      };

      logout = () => {
        this.setToken(null)
        this.setUser(null);
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