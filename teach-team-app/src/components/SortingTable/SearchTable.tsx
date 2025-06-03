import { subject, User, userState } from "@/helpers/validate";
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
        // if (sort === "none") {
        //     tempTable = tempTable.filter((e)=>{
        //         const acceptedCount = getAcceptedCount(e.email, classes);
        //         return !acceptedCount || acceptedCount === 0;
        //     });
        // }
    }

    return tempTable;
}

export function SearchTable({ tableDataIn }: searchTableProps)
{
    // let formatTable = [...tableArr];

    // console.log(sort);

    //https://owlcation.com/stem/creating-a-sortable-list-in-react-js  
    // if (sort !== "none") {
    //     formatTable.sort((a, b) => {
    //         //Compares two elements. so if one were greater then the other than the other (by subtraction) then put that element after
    //         const A = getAcceptedCount(a.email, classes) || 0;
    //         const B = getAcceptedCount(b.email, classes) || 0;
            
    //         //least
    //         if (sort === "ascending") {
    //             return A - B;
    //         } 
    //         //most
    //         else {
    //             return B - A;
    //         };
    //     });
    // }
    
    // if(sort === "none Accepted")
    //     {
    //         formatTable = formatTable.filter((e)=>{
    //             const acceptedCount = getAcceptedCount(e.email, classes) || 0
    //             return acceptedCount === 0;
    //     })}

    // if(keyword.length > 0) // If something has been written into the search box
    //     {
    //         formatTable = keywordFilter(keyword, type, formatTable, classes);
    //     }

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
            {tableDataIn.map((tut) => (
                // On hover display tutor information
                <HoverCard.Root key={tut.person.email} openDelay={500} closeDelay={100}>
                    <HoverCard.Trigger asChild>
                        <Table.Row key={tut.person.email}>
                            {/* Display other information in body */}
                            <Table.Cell p="4" fontSize="md">{tut.person.full_name??"Not Provided"}</Table.Cell> {/*Tutor Name*/}
                            <Table.Cell p="4" fontSize="md">{tut.person.email??"Not Provided"}</Table.Cell> {/*Tutor Email*/}
                            <Table.Cell p="4" fontSize="md">{tut.applied.length >= 1 ? tut.applied.map((x, i) => <tr key={i}>{ x.courseName + " - " + x.courseCode}</tr>) : "Not Provided"}</Table.Cell> {/*Applied Courses*/}
                            <Table.Cell p="4" fontSize="md">{tut.accepted.length >= 1 ? tut.accepted.map((x, i) => <tr key={i}>{x.courseName + " - " + x.courseCode}</tr>) : "Not Provided"}</Table.Cell> {/*Accepted Courses*/}
                            <Table.Cell p="4" fontSize="md">{tut.person.availability.length >= 1 ? tut.person.availability : ["Not Provided"].map((x)=><tr key={x}>{x}</tr>)}</Table.Cell> {/*Availability*/}
                            <Table.Cell p="4" fontSize="md">{Array.isArray(tut.person.skills) && tut.person.skills.length >= 1 ? tut.person.skills.map((x, i) => <tr key={i}>{x}</tr>) : "Not Provided"}</Table.Cell> {/*Skills*/}
                            <Table.Cell p="4" fontSize="md">{tut.timesAccepted??"# Not Calculated"}</Table.Cell> {/*Accepted*/}
                        </Table.Row>
                    </HoverCard.Trigger>
                    <Portal>
                        <HoverCard.Positioner>
                            <HoverCard.Content>
                                <HoverCard.Arrow/>
                                <Box p="4" className="lecturerBox">
                                    <h2>{tut.person.full_name??"No Name Provided"}</h2>
                                    <h3>Summary: {tut.person.summary??"No Summary Provided"}</h3>
                                    <h3>Previous Roles: {tut.person.previous_roles??"No Previous Roles"}</h3>
                                    <h3>Availability: {tut.person.availability??"No Availability Provided"}</h3>
                                    <h3>Education: {tut.person.educations??"No Education Provided"}</h3>
                                    <h3>Certifications: {tut.person.certifications??"No Certifications Provided"}</h3>
                                    <h3>Skills: {tut.person.skills??"No Skills Provided"}</h3>
                                    <h3>Languages: {tut.person.languages??"No Languages Provided"}</h3>
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