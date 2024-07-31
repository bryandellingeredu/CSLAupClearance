import { Divider, Header, Icon } from "semantic-ui-react";
import ClearanceTable from "./clearanceTable";

export default function ClearanceWrapper(){

    return (
      <>
        <Divider horizontal>
        <Header as='h1'>
          <Icon name='shield alternate' style={{ color: '#333F50' }} />
          G2 CLEARANCE
        </Header>
      </Divider>
      <ClearanceTable />
      </>
    )
}