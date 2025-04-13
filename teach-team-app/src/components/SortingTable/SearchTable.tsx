import { getAcceptedCount, getAcceptedCourses, getAppliedCourses } from "@/helpers/localStorageGet";
import { subject, userState } from "@/helpers/validate";
import { Box, HoverCard, Portal, Table } from "@chakra-ui/react";

type searchTableProps = {tableArr: userState[], classes: subject[], type: string, keyword: string, order: string}

//Search for specific data in local storage
function getDetails(searchFor: string, email :string, defaultSentence :string) {
    let detail = localStorage.getItem(`${searchFor}_${email}`)
    if (!detail) {
        detail = defaultSentence;
    }
    return detail;
}

export function SearchTable({ tableArr, classes, type, keyword, order }: searchTableProps)
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
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Times Accepted</Table.ColumnHeader>
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
                            <Table.Cell p="4" fontSize="md">{tut.name??"Not Provided"}</Table.Cell> {/*Tutor Name*/}
                            <Table.Cell p="4" fontSize="md">{tut.email??"Not Provided"}</Table.Cell> {/*Tutor Email*/}
                            <Table.Cell p="4" fontSize="md">{getAppliedCourses(tut.email, classes).length >= 1 ? getAppliedCourses(tut.email, classes).map((x)=><tr>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Applied Courses*/}
                            <Table.Cell p="4" fontSize="md">{getAcceptedCourses(tut.email, classes).length >= 1 ? getAcceptedCourses(tut.email, classes).map((x)=><tr>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Accepted Courses*/}
                            <Table.Cell p="4" fontSize="md">{tut.avail && tut.avail[0].length >= 1 ? tut.avail : ["Not Provided"].map((x)=><tr>{x}</tr>)}</Table.Cell> {/*Availability*/}
                            <Table.Cell p="4" fontSize="md">{tut.skills && tut.skills[0].length >= 1 ? tut.skills : ["Not Provided"].map((x)=><tr>{x}</tr>)}</Table.Cell> {/*Skills*/}
                            <Table.Cell p="4" fontSize="md">{getAcceptedCount(tut.email, classes)??"# Not Calculated"}</Table.Cell> {/*Accepted*/}
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