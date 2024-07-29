import { makeAutoObservable } from "mobx";
import { User } from "../models/user";
import agent from "../api/agent";

export default class UserStore {
    user: User | null = null;
    loggingIn: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }


    login = async (token: string) => {
        this.setLoggingIn(true);
        try {
          debugger;
          const user = await agent.Account.login(token);
          console.log(user)
        } catch (error) {

          this.user = null;
          console.log(error);
        } finally {
            debugger;
            this.setLoggingIn(false);
        }
      };

    setLoggingIn = (loggingIn: boolean) => {
        this.loggingIn = loggingIn;
      };




}