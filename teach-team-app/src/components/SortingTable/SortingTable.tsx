import { generateSubjects, generateUsers, subject, userState } from "@/helpers/validate";
import { SetStateAction } from "react";
import { Table, HoverCard, Portal, Checkbox, Box } from "@chakra-ui/react";


export interface dualTableProps
{
    table1: userState[],
    setTable1: (value: SetStateAction<userState[]>) => void,
    table2: userState[],
    setTable2: (value: SetStateAction<userState[]>) => void;
}

function swapTables(index: number,table1: userState[], sTable1:(value: SetStateAction<userState[]>) => void, table2: userState[], sTable2:(value: SetStateAction<userState[]>) => void)
{
    //https://www.seanmcp.com/articles/remove-an-item-at-a-given-index-in-javascript/
    //Filter where index => index != indexVar
    const tempTable1: userState[] = table1.filter((e, i) => i !== index); // Remove item at index from table1
    const tempTable2: userState[] = [...table2, table1[index]]; // Add the item to the top of table 2

    //Update using the hooks
    sTable1(tempTable1);
    sTable2(tempTable2);
}

export function TutorSubjectTable({table1, table2, setTable1, setTable2}: dualTableProps)
{

    //Create the tablekey 
    return(
        <Table.Root 
            variant="outline" 
            size="lg" 
            borderWidth="1px" 
            rounded="md"
            width="100%" 
            backgroundColor="white"
            interactive
        >
        {/* Header of the table */}
        <Table.Header>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Tutor Name</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Tutor Role</Table.ColumnHeader>
        </Table.Header>
        {/* Body of the table */}
        <Table.Body>
            {/* Table Row Factory */}
            {table1.map((tut, index) => (
                // On hover display tutor information
                <HoverCard.Root openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email} onClick={(e)=>{ 
                            swapTables(index, table1, setTable1, table2, setTable2);
                            }}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.email}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{tut.role}</Table.Cell>
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow/>
                                <Box p="4">
                                    <h3>Email: {tut.email}</h3>
                                    <h3>Role: {tut.role}</h3>
                                </Box>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            ))}
        </Table.Body>
    </Table.Root>);
}