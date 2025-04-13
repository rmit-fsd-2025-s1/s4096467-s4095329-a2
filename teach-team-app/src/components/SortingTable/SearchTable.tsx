import { getAcceptedCount, getAcceptedCourses, getAppliedCourses } from "@/helpers/localStorageGet";
import { subject, userState } from "@/helpers/validate";
import { Box, HoverCard, Portal, Table } from "@chakra-ui/react";

type searchTableProps = {tableArr: userState[], classes: subject[]}

export function SearchTable({ tableArr, classes }: searchTableProps)
{
    return(<Table.Root 
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
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Tutor Email</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Applied Courses</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Accepted Courses</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Availability</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Skillset</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Number of accepted</Table.ColumnHeader>
        </Table.Header>
        {/* Body of the table */}
        <Table.Body>
            {/* Table Row Factory */}
            {tableArr.map((tut, index) => (
                tut.role == "tutor" ?(
                // On hover display tutor information
                <HoverCard.Root openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.name??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{tut.email??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{getAppliedCourses(tut.email, classes).join(", ")??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{getAcceptedCourses(tut.email, classes).join(", ")??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{tut.avail??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{tut.skills??"Not Provided"}</Table.Cell>
                            <Table.Cell p="4" fontSize="md">{getAcceptedCount(tut.email, classes)??"Not Provided"}</Table.Cell>
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
                ):<></>
            ))}
        </Table.Body>
    </Table.Root>
    );
        <div>ae</div>
}