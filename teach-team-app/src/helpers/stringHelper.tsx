export function toSentenceCase(stringIn: string): string{
    if(!stringIn) 
        return "";
    
    return(stringIn.charAt(0).toUpperCase() + stringIn.slice(1));
}