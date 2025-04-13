import { userState } from "@/helpers/validate";
import { SetStateAction } from "react";
import { Table, HoverCard, Portal, Box, Button, Text } from "@chakra-ui/react";


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
        const tempTable1: userState[] = [ ...table1 ];
        const selectTutor: userState = tempTable1[index];

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
                <HoverCard.Root key={index} size="xs" openDelay={300} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email} onClick={()=>{ 
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
                            <HoverCard.Content width="500px" maxW="100vw" minW="300px">
                                <HoverCard.Arrow bg="green.50"/>
                                <Box p="4" className="lecturerBox" fontSize="lg" boxShadow="md" bg="green.50">
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Email - </Text>{tut.email ?? "None"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Summary - </Text>{tut.summary && tut.summary[0].length >= 1 ? tut.summary : "No summary Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Previous Roles - </Text>{tut.prevRoles && tut.prevRoles[0].length >= 1 ? tut.prevRoles : "No roles Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Availability - </Text>{tut.avail && tut.avail[0].length >= 1 ? tut.avail : "No availability Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Education - </Text>{tut.education && tut.education[0].length >= 1 ? tut.education : "No education Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Certifications - </Text>{tut.certifications && tut.certifications[0].length >= 1 ? tut.certifications : "No Certifications Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Skills - </Text>{tut.skills && tut.skills[0].length >= 1 ? tut.skills : "No Skills Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Languages - </Text>{tut.languages && tut.languages[0].length >= 1 ? tut.languages : "No Languages Provided"}</Text>
                                </Box>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            ))}
        </Table.Body>
    </Table.Root>);
}