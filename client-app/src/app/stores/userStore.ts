import { makeAutoObservable, reaction } from "mobx";
import { User } from "../models/user";
import agent from "../api/agent";

export default class UserStore {
    user: User | null = null;
    loggingIn: boolean = false;
    token: string | null | undefined = localStorage.getItem('g2jwt');
    appLoaded = false;

    constructor() {
       debugger;
        makeAutoObservable(this);
        reaction(
            () => this.token,
            token => {
              debugger;
                if (token){
                    debugger;
                    localStorage.setItem('g2jwt', token);
                } else {
                    localStorage.removeItem('g2jwt');
                    debugger;
                }
            }
        )
    }


    login = async (graphtoken: string) => {
      debugger;
        this.setLoggingIn(true);
        try {
          debugger;
          const user = await agent.Account.login(graphtoken);
          this.setUser(user);
          this.setToken(user.token);
        } catch (error) {
          debugger;
          this.user = null;
          this.setToken(null)
          console.log(error);
        } finally {
            debugger;
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
    


}