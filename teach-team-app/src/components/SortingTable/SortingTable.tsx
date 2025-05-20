import { User } from "@/helpers/validate";
import { SetStateAction } from "react";
import { Table, HoverCard, Portal, Box, Text } from "@chakra-ui/react";


export interface dualTableProps
{
    table1: User[],
    setTable1: (value: SetStateAction<User[]>) => void,
    table2: User[],
    setTable2: (value: SetStateAction<User[]>) => void;
}

function swapTables(index: number,table1: User[], sTable1:(value: SetStateAction<User[]>) => void, table2: User[], sTable2:(value: SetStateAction<User[]>) => void)
{
    //https://www.seanmcp.com/articles/remove-an-item-at-a-given-index-in-javascript/
    //Filter where index => index != indexVar
    const tempTable1: User[] = table1.filter((e, i) => i !== index); // Remove item at index from table1
    const tempTable2: User[] = [...table2, table1[index]]; // Add the item to the top of table 2

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
                <HoverCard.Root key={index} openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email} onClick={()=>{ 
                            swapTables(index, table1, setTable1, table2, setTable2);
                            }}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.full_name??tut.email}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{tut.availability??"Not Provided"}</Table.Cell>
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content width="500px" maxW="90vw" minW="300px">
                                <HoverCard.Arrow bg="green.50"/>
                                <Box p="4" className="lecturerBox" fontSize="lg" boxShadow="md" bg="green.50">
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Email - </Text>{tut.email ?? "None"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Summary - </Text>{tut.summary && tut.summary[0].length >= 1 ? tut.summary : "No summary Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Previous Roles - </Text>{tut.previous_roles && tut.previous_roles[0].length >= 1 ? tut.previous_roles : "No roles Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Availability - </Text>{tut.availability && tut.availability[0].length >= 1 ? tut.availability : "No availability Provided"}</Text>
                                    <br/>
                                    <Text as="h2"><Text as="span" fontWeight="bold" color="green.600" fontSize="20px" display="inline" mr="1">Education - </Text>{tut.educations && tut.educations[0].length >= 1 ? tut.educations : "No education Provided"}</Text>
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