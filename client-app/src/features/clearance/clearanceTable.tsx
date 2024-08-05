import { observer } from "mobx-react-lite";
import { useStore } from '../../app/stores/store';
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/loadingComponent";
import { Button, Icon, Input, Radio, Segment, SegmentGroup, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import ClearanceTableRow from "./clearanceTableRow";
import { EventUser } from "../../app/models/eventUser";

export default observer(function ClearanceTable() {
    const { eventUserStore, eventStore } = useStore();
    const { loadEvents } = eventStore;
    const { eventUsers, loadingInitial, loadEventUsers } = eventUserStore;
    const [sort, setSort] = useState('lastDesc');
    const [sortedEventUsers, setSortedEventUsers] = useState<EventUser[]>([]);
    const [filters, setFilters] = useState({
        cleared: 'all',
        lastName: '',
        firstName: '',
        eventName: ''
    });

    useEffect(() => {
        loadEvents();
    }, [eventStore]);

    useEffect(() => {
        loadEventUsers();
    }, [eventUserStore]);

    useEffect(() => {
        handleSortAndFilter(eventUsers, sort, filters);
    }, [eventUsers, sort, filters]);

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFilters({ ...filters, [field]: e.target.value });
    };

    const handleClearedFilterChange = (e: React.FormEvent<HTMLInputElement>, { value }: any) => {
        setFilters({ ...filters, cleared: value });
    };

    const handleSortAndFilter = (eventUsers: EventUser[], sort: string, filters: any) => {
        let filteredUsers = eventUsers.filter((user) => {
            const matchCleared = filters.cleared === 'all' || (filters.cleared === 'cleared' && user.cleared) || (filters.cleared === 'uncleared' && !user.cleared);
            const matchLastName = user.lastName.toLowerCase().includes(filters.lastName.toLowerCase());
            const matchFirstName = user.firstName.toLowerCase().includes(filters.firstName.toLowerCase());
            const matchEventName = user.eventName.toLowerCase().includes(filters.eventName.toLowerCase());

            return matchCleared && matchLastName && matchFirstName && matchEventName;
        });

        switch (sort) {
            case 'clearedAsc':
                filteredUsers.sort((a, b) => Number(a.cleared) - Number(b.cleared));
                break;
            case 'clearedDesc':
                filteredUsers.sort((a, b) => Number(b.cleared) - Number(a.cleared));
                break;
            case 'lastAsc':
                filteredUsers.sort((a, b) => b.lastName.localeCompare(a.lastName));
                break;
            case 'lastDesc':
                filteredUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
                break;
            case 'firstAsc':
                filteredUsers.sort((a, b) => b.firstName.localeCompare(a.firstName));
                break;
            case 'firstDesc':
                filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
                break;
            case 'eventAsc':
                filteredUsers.sort((a, b) => b.eventName.localeCompare(a.eventName));
                break;
            case 'eventDesc':
                filteredUsers.sort((a, b) => a.eventName.localeCompare(b.eventName));
                break;
            default:
                break;
        }
        setSortedEventUsers(filteredUsers);
    };

    const uniqueValues = (key: keyof EventUser) => {
        return [...new Set(
            eventUsers
                .map(user => user[key])
                .filter(value => typeof value !== 'boolean')
        )].sort((a, b) => 
            a!.toString().localeCompare(b!.toString())
        );
    };

    const exportToExcel = () => {
        const protocol = window.location.protocol;
       const baseUrl  = protocol === 'https:' ?  import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL_HTTP;
       const url = `${baseUrl}/ExportToExcel`
       if(sortedEventUsers && sortedEventUsers.length > 0){
        const data = {eventUserIds: sortedEventUsers.map(x => x.id)};
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(res => res.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "eventusers.csv");
              document.body.appendChild(link);
              link.click();
            });
       }

    }

    if (loadingInitial) return <LoadingComponent content='Loading app' />

    return (
        <>
            <Table celled inverted>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>
                            <h1>
                                <span style={{ paddingRight: '20px' }}>CLEARED</span>
                                <Icon name='arrow up' color={sort === 'clearedDesc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('clearedDesc')} />
                                <Icon name='arrow down' color={sort === 'clearedAsc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('clearedAsc')} />
                            </h1>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            <h1>
                                <span style={{ paddingRight: '20px' }}>LAST</span>
                                <Icon name='arrow up' color={sort === 'lastDesc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('lastDesc')} />
                                <Icon name='arrow down' color={sort === 'lastAsc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('lastAsc')} />
                            </h1>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            <h1>
                                <span style={{ paddingRight: '20px' }}>FIRST</span>
                                <Icon name='arrow up' color={sort === 'firstDesc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('firstDesc')} />
                                <Icon name='arrow down' color={sort === 'firstAsc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('firstAsc')} />
                            </h1>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            <h1>MIDDLE</h1>
                        </TableHeaderCell>
                        <TableHeaderCell>
                     
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h1>
                                        <span style={{ paddingRight: '20px' }}>EVENT</span>
                                        <Icon name='arrow up' color={sort === 'eventDesc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('eventDesc')} />
                                        <Icon name='arrow down' color={sort === 'eventAsc' ? 'blue' : undefined} style={{ cursor: 'pointer' }} onClick={() => handleSortChange('eventAsc')} />
                                    </h1>
                                </div>
                                <Button icon labelPosition='left' color='black' onClick={exportToExcel}>
                                    <Icon name='download' />
                                    EXPORT TO EXCEL
                                </Button>
                            </div>
                        
                        </TableHeaderCell>
                    </TableRow>
                    <TableRow>
                        <TableHeaderCell>
                            <SegmentGroup horizontal>
                                <Segment>
                                    <Radio
                                        label='Show All'
                                        name='radioGroup'
                                        value='all'
                                        checked={filters.cleared === 'all'}
                                        onChange={handleClearedFilterChange}
                                    />
                                </Segment>
                                <Segment>
                                    <Radio
                                        label='Uncleared'
                                        name='radioGroup'
                                        value='uncleared'
                                        checked={filters.cleared === 'uncleared'}
                                        onChange={handleClearedFilterChange}
                                    />
                                </Segment>
                                <Segment>
                                    <Radio
                                        label='Cleared'
                                        name='radioGroup'
                                        value='cleared'
                                        checked={filters.cleared === 'cleared'}
                                        onChange={handleClearedFilterChange}
                                    />
                                </Segment>
                            </SegmentGroup>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            <Input fluid value={filters.lastName} onChange={(e) => handleFilterChange(e, 'lastName')} list="lastName-options" icon='search' />
                            <datalist id="lastName-options">
                                {uniqueValues('lastName').map(value => (
                                    <option key={value!.toString()} value={value!.toString()} />
                                ))}
                            </datalist>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            <Input fluid value={filters.firstName} onChange={(e) => handleFilterChange(e, 'firstName')} list="firstName-options" icon='search' />
                            <datalist id="firstName-options">
                                {uniqueValues('firstName').map(value => (
                                    <option key={value!.toString()} value={value!.toString()} />
                                ))}
                            </datalist>
                        </TableHeaderCell>
                        <TableHeaderCell>

                        </TableHeaderCell>
                        <TableHeaderCell>
                            <Input fluid value={filters.eventName} onChange={(e) => handleFilterChange(e, 'eventName')} list="eventName-options" icon='search' />
                            <datalist id="eventName-options">
                                {uniqueValues('eventName').map(value => (
                                    <option key={value!.toString()} value={value!.toString()} />
                                ))}
                            </datalist>
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedEventUsers.map((eventUser) => (
                        <ClearanceTableRow key={eventUser.id} eventUser={eventUser} />
                    ))}
                </TableBody>
            </Table>
        </>
    )
});
