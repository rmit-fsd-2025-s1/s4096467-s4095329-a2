export default function aboutUs()
{
    const daysSince = Math.floor((new Date().getTime() - new Date("2025/05/6").getTime()) / (1000 * 60 * 60 * 24));

    return(<h5>Days since company founding: {daysSince}</h5>);
}