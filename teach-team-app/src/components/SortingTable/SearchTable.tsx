import { toSentenceCase } from "@/helpers/stringHelper";
import { User } from "@/helpers/validate";
import { Box, HoverCard, Portal, Table } from "@chakra-ui/react";

type searchTableProps = {tableDataIn: userData[]}

export interface userData{
    person: User,
    applied: {
        courseCode: string,
        courseName: string,
        tutorStatus: boolean,
        labStatus: boolean
    }[],
    accepted: {
        courseCode: string,
        courseName: string,
        tutorStatus: boolean,
        labStatus: boolean
    }[],
    timesAccepted: number
}

export function SearchTable({ tableDataIn }: searchTableProps)
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
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Educator Name</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Educator Email</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Applied Courses</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Accepted Courses</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Availability</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Skillset</Table.ColumnHeader>
            <Table.ColumnHeader p="4" fontSize="xl" fontWeight="bold" bg="gray.100" color="black">Times Accepted</Table.ColumnHeader>
        </Table.Header>
        {/* Body of the table */}
        <Table.Body>
            {/* Table Row Factory */}
            {tableDataIn.map((tut) => (
                // On hover display tutor information
                <HoverCard.Root key={tut.person.email} openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.person.email}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.person.full_name??"Not Provided"}</Table.Cell> {/*Tutor Name*/}
                            <Table.Cell p="4" fontSize="md">{tut.person.email??"Not Provided"}</Table.Cell> {/*Tutor Email*/}
                            <Table.Cell p="4" fontSize="md">{tut.applied.length >= 1 ? tut.applied.map((x, i) => <tr key={i}>{ x.courseName + " - " + x.courseCode} ({x.tutorStatus? "T":""}{x.tutorStatus && x.labStatus ? "+":""}{x.labStatus ? "L":""})</tr>) : "None"}</Table.Cell> {/*Applied Courses*/}
                            <Table.Cell p="4" fontSize="md">{tut.accepted.length >= 1 ? tut.accepted.map((x, i) => <tr key={i}>{ x.courseName + " - " + x.courseCode} ({x.tutorStatus? "T":""}{x.tutorStatus && x.labStatus ? "+":""}{x.labStatus ? "L":""})</tr>) : "None"}</Table.Cell> {/*Accepted Courses*/}
                            <Table.Cell p="4" fontSize="md">{tut.person.availability.length >= 1 ? toSentenceCase(tut.person.availability) : ["Not Provided"].map((x)=><tr key={x}>{x}</tr>)}</Table.Cell> {/*Availability*/}
                            <Table.Cell p="4" fontSize="md">{Array.isArray(tut.person.skills) && tut.person.skills.length >= 1 ? tut.person.skills.map((x, i) => <tr key={i}>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Skills*/}
                            <Table.Cell p="4" fontSize="md">{tut.timesAccepted??"# Not Calculated"}</Table.Cell> {/*Accepted*/}
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow/>
                                {/* I don't know why I used ul here, but it works. Usually I don't do that. */}
                                <Box p="4" className="lecturerBox">
                                    <h2><strong>{tut.person.full_name??"No Name Provided"}</strong></h2>
                                    <h3><strong>Summary:</strong><ul>{tut.person.summary??"No Summary Provided"}</ul></h3>
                                    <h3><strong>Previous Roles:</strong> {tut.person.previous_roles.length >= 1 ? tut.person.previous_roles.map((x,i) => <ul key={i}>{x}</ul>) :<ul>No Previous Roles</ul>}</h3>
                                    <h3><strong>Availability:</strong> <ul>{toSentenceCase(tut.person.availability)??"No Availability Provided"}</ul></h3>
                                    <h3><strong>Education:</strong> {tut.person.educations.length >= 1 ? tut.person.educations.map((x,i)=> <ul key={i}>{x}</ul>) : <ul>No Education Provided</ul>}</h3>
                                    <h3><strong>Certifications:</strong> {tut.person.certifications.length >= 1 ? tut.person.certifications.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Certifications Provided</ul>}</h3>
                                    <h3><strong>Skills:</strong> {tut.person.skills.length >= 1 ? tut.person.skills.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Skills Provided</ul>}</h3>
                                    <h3><strong>Languages:</strong> {tut.person.languages.length >= 1 ? tut.person.languages.map((x,i) => <ul key={i}>{x}</ul>) : <ul>No Languages Provided</ul>}</h3>
                                </Box>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
            ))}
        </Table.Body>
    </Table.Root>
    );
        <div>ae</div>
}