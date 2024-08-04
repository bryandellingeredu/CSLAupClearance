interface Props {
    clearedBy: string,
    clearedAt: Date | null
}

export default function PopoverCleared({clearedBy, clearedAt} : Props){
    return(
        <div>
            <p><strong>Cleared By: </strong> {clearedBy}</p>
           <p><strong>Cleared At: </strong> {clearedAt ? new Date(clearedAt).toLocaleDateString() : 'N/A'}</p>
        </div>
    )
}