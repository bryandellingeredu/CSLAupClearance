import { createContext, useContext } from "react";
import UserStore from "./userStore";
import EventUserStore from "./eventUserStore";
import EventStore from "./eventStore";
import ModalStore from "./modalStore";

interface Store{
    userStore: UserStore;
    eventUserStore: EventUserStore;
    eventStore: EventStore;
    modalStore: ModalStore;
}

export const store: Store ={
    userStore: new UserStore(),
    eventUserStore: new EventUserStore(),
    eventStore: new EventStore(),
    modalStore: new ModalStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}