import { generateSubjects, generateUsers, subject, userState } from "@/helpers/validate";
import { SetStateAction } from "react";
import { Table, HoverCard, Portal, Checkbox, Box, Text } from "@chakra-ui/react";


export interface dualTableProps
{
    table1: userState[],
    setTable1: (value: SetStateAction<userState[]>) => void,
    table2: userState[],
    setTable2: (value: SetStateAction<userState[]>) => void;
}

//Search for specific data in local storage
function getDetails(searchFor: string, email :string, defaultSentence :string) {
    let detail = localStorage.getItem(`${searchFor}_${email}`)
    if (!detail) {
        detail = defaultSentence;
    }
    return detail;
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
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Tutor Availability</Table.ColumnHeader>
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
                            <Table.Cell p="4" fontSize="md">{tut.avail??"Not Provided"}</Table.Cell>
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content width="500px" maxW="90vw" minW="300px">
                                <HoverCard.Arrow bg="green.50"/>
                                <Box p="4" className="lecturerBox" fontSize="lg" boxShadow="md" bg="green.50">
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Email - </Text>{tut.email ?? "None"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Summary - </Text>{getDetails('summary', tut.email, "No summary Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Previous Roles - </Text>{getDetails('prevRoles', tut.email, "No roles Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Availability - </Text>{getDetails('avail', tut.email, "No availability Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Education - </Text>{getDetails('education', tut.email, "No education Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Certifications - </Text>{getDetails('certifications', tut.email, "No Certifications Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Skills - </Text>{getDetails('skills', tut.email, "No Skills Provided")}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Languages - </Text>{getDetails('languages', tut.email, "No Languages Provided")}</Text>
                                </Box>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            ))}
        </Table.Body>
    </Table.Root>);
}