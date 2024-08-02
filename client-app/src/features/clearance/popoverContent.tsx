import { observer } from "mobx-react-lite";
import { useStore } from '../../app/stores/store';
import LoadingComponent from "../../app/layout/loadingComponent";
import { useEffect, useState } from "react";
import { Event } from "../../app/models/event";
import { Card } from "semantic-ui-react";

interface Props {
    eventId: number
}


export default observer( function PopoverContent({eventId} : Props){
    const { eventStore } = useStore();

    const [event, setEvent] = useState<Event>({
        id: 0,
        name: '',
        startDate: null,
        endDate: null,
        networks: [],
        coordinators: []
    });
    useEffect(() => {
        const fetchEvent = async () => {
            const fetchedEvent = eventStore.getEventById(eventId);
            if (fetchedEvent) {
                setEvent(fetchedEvent);
            } else {
                console.log('Event not found');
            }
        };
        fetchEvent();
    }, [eventStore, eventId]);

    useEffect
    if (!event) return <LoadingComponent content="loading Data" />
    return (
        <Card>
        <Card.Content>
            <Card.Header>{event.name}</Card.Header>
            <Card.Meta>
                Start Date: {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'N/A'}
            </Card.Meta>
            <Card.Meta>
                End Date: {event.endDate ? new Date(event.endDate).toLocaleDateString() : 'N/A'}
            </Card.Meta>
            <Card.Description>
                <strong>Networks:</strong>
                <ul>
                    {event.networks.map((network) => (
                        <li key={network.name}>{network.description}</li>
                    ))}
                </ul>
                <strong>Coordinators:</strong>
                <ul>
                    {event.coordinators.map((coordinator) => (
                        <li key={coordinator.email}>
                            {coordinator.firstName} {coordinator.lastName} - <a href={`mailto:${coordinator.email}`}>{coordinator.email}</a>
                        </li>
                    ))}
                </ul>
            </Card.Description>
        </Card.Content>
    </Card>
    );
})