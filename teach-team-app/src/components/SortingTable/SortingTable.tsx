import { generateSubjects, generateUsers, subject, userState } from "@/helpers/validate";
import { Table, HoverCard, Portal, Checkbox } from "@chakra-ui/react";
import { SetStateAction } from "react";

export interface dualTableProps
{
    table1: userState[],
    setTable1: (value: SetStateAction<userState[]>) => void,
    table2: userState[],
    setTable2: (value: SetStateAction<userState[]>) => void;
}

export function TutorSubjectTable({table1, table2, setTable1, setTable2}: dualTableProps)
{

    //Create the table
    return(<Table.Root borderWidth="1px" rounded="md" interactive>
        {/* Header of the table */}
        <Table.Header>
            <Table.ColumnHeader>Tutor Name</Table.ColumnHeader>
            <Table.ColumnHeader>Tutor Role</Table.ColumnHeader>
        </Table.Header>
        {/* Body of the table */}
        <Table.Body>
            {/* Table Row Factory */}
            {table1.map((tut) => (
                // On hover display tutor information
                // <HoverCard.Root openDelay={500} closeDelay={100}>
                //     <HoverCard.Trigger asChild>
                        //Table Row Declaration
                        <Table.Row key={tut.email} onClick={(e)=>{console.log("ae")}}>
                            {/* Display other information in body */}
                            <Table.Cell>{tut.email}</Table.Cell>
                            <Table.Cell>{tut.role}</Table.Cell>
                        </Table.Row>
                //     </HoverCard.Trigger>
                //     <Portal>
                //         <HoverCard.Positioner>
                //             <HoverCard.Content>
                //                 <HoverCard.Arrow/>
                //                 <div>
                //                     <h3>Email: {tut.email}</h3>
                //                     <h3>Role: {tut.role}</h3>
                //                 </div>
                //             </HoverCard.Content>
                //         </HoverCard.Positioner>
                //     </Portal>
                // </HoverCard.Root>
                
            ))}
        </Table.Body>
    </Table.Root>);
}




