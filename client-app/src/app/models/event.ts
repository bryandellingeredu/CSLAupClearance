import { Coordinator } from "./coordinator";
import { Network } from "./network";

export interface Event{
    id: number;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    networks: Network[];
    coordinators: Coordinator[];
}