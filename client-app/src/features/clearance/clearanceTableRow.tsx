import { Button, Checkbox, Icon, Popup, TableCell, TableRow } from "semantic-ui-react";
import { EventUser } from "../../app/models/eventUser";
import { useStore } from '../../app/stores/store';
import { observer } from "mobx-react-lite";
import PopoverContent from './popoverContent';

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
            <TableCell className="event-cell">
    <div className="event-content">
      <Popup
        trigger={
          <Button icon size="tiny" className="info-button" circular color='black'>
            <Icon name="info" />
          </Button>
        }
        content={<PopoverContent eventId={eventUser.eventId} />}
        on="click"
        position="top right"
        closeOnDocumentClick
      />
      <h2>{eventUser.eventName}</h2>
    </div>
  </TableCell>
        </TableRow>
    )

})
