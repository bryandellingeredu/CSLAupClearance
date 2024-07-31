import { createContext, useContext } from "react";
import UserStore from "./userStore";
import EventUserStore from "./eventUserStore";
import EventStore from "./eventStore";

interface Store{
    userStore: UserStore;
    eventUserStore: EventUserStore;
    eventStore: EventStore;
}

export const store: Store ={
    userStore: new UserStore(),
    eventUserStore: new EventUserStore(),
    eventStore: new EventStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}