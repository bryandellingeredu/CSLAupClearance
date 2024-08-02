import { makeAutoObservable } from "mobx";
import { Event } from "../models/event";
import agent from "../api/agent";

export default class EventStore {


    eventRegistry = new Map<number, Event>();
    loadingInitial = false;

    constructor(){
        makeAutoObservable(this);
    }

    get events() {
        return Array.from(this.eventRegistry.values())
    }

    loadEvents = async () =>{
        this.setLoadingInitial(true);
     try{
        debugger;
        const events = await agent.Events.list();
        events.forEach(event => {
            this.eventRegistry.set(event.id, event);
        })
        this.setLoadingInitial(false);
     } catch(error) {
      console.log(error);
      this.setLoadingInitial(false);
     }
    }

    setLoadingInitial = (state : boolean) => {
        this.loadingInitial = state;
      };

      getEventById = (eventId: number): Event | undefined => {
        return this.eventRegistry.get(eventId);
    }
}