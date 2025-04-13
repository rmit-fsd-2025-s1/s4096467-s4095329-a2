import { getAcceptedCount, getAcceptedCourses, getAppliedCourses } from "@/helpers/localStorageGet";
import { subject, userState } from "@/helpers/validate";
import { Box, HoverCard, Portal, Table } from "@chakra-ui/react";

type searchTableProps = {tableArr: userState[], classes: subject[], type: string, keyword: string, order: string}

// Searches for key word based on inputted type
function keywordFilter(keyWord: string, type: string, table: userState[], subject: subject[]) : userState[]
{
    let tempTable = [...table];

    const formattedKeyword = keyWord.toLowerCase();

    switch(type)
    {
            //Check by courses
        case "Course":
            //Getting the list of tutors returned from the lookup
            let tutKey: string[] = [];

            let tempKey11: string[] = [];
            let tempKey12: string[] = [];
            let tempKey21: string[] = [];
            let tempKey22: string[] = [];

            tempKey11 = subject.filter((e)=>{
                return e.code.toLowerCase().includes(formattedKeyword) ?? false
            }).flatMap((val) => val.accepted);

            tempKey12 = subject.filter((e)=>{
                return e.code.toLowerCase().includes(formattedKeyword) ?? false
            }).flatMap((val) => val.candidates);

            tempKey21 = subject.filter((e)=>{
                return e.subjectName.toLowerCase().includes(formattedKeyword) ?? false
            }).flatMap((val) => val.accepted);

            tempKey22 = subject.filter((e)=>{
                return e.subjectName.toLowerCase().includes(formattedKeyword) ?? false
            }).flatMap((val) => val.candidates);

            // https://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript

            const u1: string[] = [...new Set([...tempKey11, ...tempKey12])]; 
            const u2: string[] = [...new Set([...tempKey21, ...tempKey22])]; 

            tutKey = [...new Set([...u1, ...u2])];

            //Applying the found values to tempTable
            tempTable = tempTable.filter((e)=>{
                return tutKey.map((email) => email.toLowerCase()).includes(e.email.toLowerCase()) ?? false;
            });

            break;
            //Check by name
        case "Name":
            tempTable = tempTable.filter((e)=>{
                return (e.name && e.name.length >=1 ? e.name : "Not Provided")?.toLowerCase().includes(formattedKeyword) ?? false
            });
            break;
            //Check by Skills
        case "Skill":
            tempTable = tempTable.filter((e)=>{
                //This ensures its an array otherwise it will cause issues
                return Array.isArray(e.skills) ? e.skills.some((skill) => (skill && skill.length > 0 ? skill : "Not Provided").toLowerCase().includes(formattedKeyword) ) : false;
            });
            break;
            //Check by availability
        case "Availability":
            tempTable = tempTable.filter((e)=>{
                return Array.isArray(e.avail) ? e.avail.some((avail) => (avail && avail.length > 0 ? avail : "Not Provided").toLowerCase().includes(formattedKeyword) ) : false;
            });
            break;
        default:
            alert("Bruh, what happened");
    }

    return tempTable;
}

export function SearchTable({ tableArr, classes, type, keyword}: searchTableProps)
{
    let formatTable = [...tableArr];

    if(keyword.length > 0) // If something has been written into the search box
        {
            formatTable = keywordFilter(keyword, type, formatTable, classes);
        }

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
            {formatTable.map((tut) => (
                tut.role == "tutor" ?(
                // On hover display tutor information
                <HoverCard.Root openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.email}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.name??"Not Provided"}</Table.Cell> {/*Tutor Name*/}
                            <Table.Cell p="4" fontSize="md">{tut.email??"Not Provided"}</Table.Cell> {/*Tutor Email*/}
                            <Table.Cell p="4" fontSize="md">{getAppliedCourses(tut.email, classes).length >= 1 ? getAppliedCourses(tut.email, classes).map((x, i) => <tr key={i}>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Applied Courses*/}
                            <Table.Cell p="4" fontSize="md">{getAcceptedCourses(tut.email, classes).length >= 1 ? getAcceptedCourses(tut.email, classes).map((x, i) => <tr key={i}>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Accepted Courses*/}
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