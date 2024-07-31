import { makeAutoObservable } from "mobx";
import { EventUser } from "../models/eventUser";
import agent from "../api/agent";

export default class EventUserStore {


    eventUserRegistry = new Map<number, EventUser>();
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this);
    }

    get eventUsers() {
        return Array.from(this.eventUserRegistry.values())
    }

    loadEventUsers = async () =>{
        this.setLoadingInitial(true);
     try{
        const eventUsers = await agent.EventUsers.list();
        eventUsers.forEach(user => {
            this.eventUserRegistry.set(user.id, user);
        })
        this.setLoadingInitial(false);
     } catch(error) {
      console.log(error);
      this.setLoadingInitial(false);
     }
    }

    updateClearance = async(id: number, cleared: boolean) =>{
        const eventUser: EventUser | undefined = this.eventUserRegistry.get(id);
        if(eventUser){
            eventUser.cleared = cleared;
            this.eventUserRegistry.set(id, eventUser);
        }
    }

    setLoadingInitial = (state : boolean) => {
        this.loadingInitial = state;
      };
}