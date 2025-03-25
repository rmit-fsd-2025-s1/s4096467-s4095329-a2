import { generateSubjects, generateUsers, subject, userState } from "@/helpers/validate";
import { Table, HoverCard, Portal } from "@chakra-ui/react";

export function TutorSubjectTable(subjectName: string)
{
    //Pull sample values
    let dbSubj: Map<string, subject> = generateSubjects();
    let dbTut: Map<string, userState> = generateUsers();
    //Create tutors array
    let tutors: userState[] = [];

    //SELECT <values> FROM tutors as t LEFT JOIN subject as s ON t.email = s.tutor WHERE s.subject_name = ?
    if(dbSubj.has(subjectName))
        {
            dbSubj.get(subjectName)?.candidates.forEach((it) => {
                const tutor = dbTut.get(it);
                if (tutor) {
                    tutors.push(tutor);
                }
            })
        }
    //Create the table
    return(<Table.Root borderWidth="1px" rounded="md" interactive>
        <Table.Header>
            <Table.ColumnHeader>Tutor Name</Table.ColumnHeader>
            <Table.ColumnHeader>Tutor Role</Table.ColumnHeader>
        </Table.Header>
        <Table.Body>
            {tutors.map((tut) => (
                <HoverCard.Root openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email}>
                            <Table.Cell>{tut.email}</Table.Cell>
                            <Table.Cell>{tut.role}</Table.Cell>
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow/>
                                <div>
                                    <h3>Email: {tut.email}</h3>
                                    <h3>Role: {tut.role}</h3>
                                </div>
                            </HoverCard.Content>
                        </HoverCard.Positioner>
                    </Portal>
                </HoverCard.Root>
                
            ))}
        </Table.Body>
    </Table.Root>);
}




