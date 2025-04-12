import { generateSubjects, generateUsers, subject, userState } from "@/helpers/validate";
import { SetStateAction } from "react";
import { Table, HoverCard, Portal, Checkbox, Box, Button } from "@chakra-ui/react";


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

//Moves the user to the next index up, reordering them upwards. Does not reorder if index is 0
function upCandidate(index: number,table1: userState[], sTable1:(value: SetStateAction<userState[]>) => void)
{
    
    if(index !== 0)
    {
        //BTW, if you are using spread (...) on an array, you need to do [ ...var ] or it returns an object and breaks everything
        let tempTable1: userState[] = [ ...table1 ];
        let selectTutor: userState = tempTable1[index];

        //Remove from array at index
        tempTable1.splice(index,1);
        //Insert at the index-1 (Move up in list)
        tempTable1.splice(index-1, 0, selectTutor);

        //Save to localStorage and update the screen
        sTable1(tempTable1);
    }
    else
    {
        alert("-_-");
    }
}

export function TutorSubjectTableSort({table1, table2, setTable1, setTable2}: dualTableProps)
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
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Tutor Availability</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black" textAlign="end">Preference Order</Table.ColumnHeader>
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
                            <Table.Cell p="4" fontSize="md">{tut.name??tut.email}</Table.Cell>
                            <Table.Cell p="4" fontSize="md" width="auto">{tut.avail??"Not Provided"}</Table.Cell>
                            {index != 0? <Table.Cell p="4" fontSize="md" textAlign="end">
                                            <Button onClick={(e)=>{e.stopPropagation(); upCandidate(index, table1, setTable1);}}>^</Button>
                                         </Table.Cell>:<Table.Cell p="4" fontSize="md" textAlign="end"></Table.Cell>}
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow/>
                                <Box p="4" className="lecturerBox">
                                    <h2>{tut.name??"No Name Provided"}</h2>
                                    <h3>Summary: {tut.summary??"No Summary Provided"}</h3>
                                    <h3>Previous Roles: {tut.prevRoles??"No Previous Roles"}</h3>
                                    <h3>Availability: {tut.avail??"No Availability Provided"}</h3>
                                    <h3>Education: {tut.education??"No Education Provided"}</h3>
                                    <h3>Certifications: {tut.certifications??"No Certifications Provided"}</h3>
                                    <h3>Skills: {tut.skills??"No Skills Provided"}</h3>
                                    <h3>Languages: {tut.languages??"No Languages Provided"}</h3>
                                </Box>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            ))}
        </Table.Body>
    </Table.Root>);
}