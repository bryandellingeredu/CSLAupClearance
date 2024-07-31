import { Checkbox, TableCell, TableRow } from "semantic-ui-react";
import { EventUser } from "../../app/models/eventUser";
import { useStore } from '../../app/stores/store';
import { observer } from "mobx-react-lite";

interface Props {
    eventUser: EventUser
}

export default observer(function ClearanceTableRow({eventUser} : Props){
    const { eventUserStore } = useStore();
    const { updateClearance } = eventUserStore;

    return(
        <TableRow>
            <TableCell >
            <Checkbox 
            toggle 
            checked={eventUser.cleared}
            onChange={() => {updateClearance(eventUser.id, !eventUser.cleared) }}
        />
            </TableCell>
            <TableCell>
                <h2>{eventUser.lastName}</h2>
            </TableCell>
            <TableCell>
            <h2>{eventUser.firstName}</h2>
            </TableCell>
            <TableCell>
            <h2>{eventUser.middleInitial}</h2>
            </TableCell>
            <TableCell>
            <h2>{eventUser.eventName}</h2>
            </TableCell>
        </TableRow>
    )

})
