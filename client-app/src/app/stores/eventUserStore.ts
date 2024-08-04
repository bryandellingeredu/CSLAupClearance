import { makeAutoObservable } from "mobx";
import { EventUser } from "../models/eventUser";
import agent from "../api/agent";
import { toast } from 'react-toastify';
import { store } from "./store";

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
            eventUser.clearedAt =  eventUser.cleared ? new Date() : null;
            eventUser.clearedBy = eventUser.cleared ? store.userStore.user!.mail : '';
            this.eventUserRegistry.set(id, eventUser);
            try{
                await agent.EventUsers.update(id, cleared)
            } catch(error){
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
    }

    setLoadingInitial = (state : boolean) => {
        this.loadingInitial = state;
      };
}