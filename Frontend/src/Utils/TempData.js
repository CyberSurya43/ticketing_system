const TempData =[
    {
        id:1,
        status:"Open_Count",
        ticketsRaised:sessionStorage.getItem('opencount')
    },
    {
        id:2,
        status:"Close_Count",
        ticketsRaised:sessionStorage.getItem('closedcount')
    },
    {
        id:3,
        status:"Hold_Count",
        ticketsRaised:sessionStorage.getItem('onholdcount')
    },
    {
        id:4,
        status:"Process_Count",
        ticketsRaised:sessionStorage.getItem('processcount')
    },
    {
        id:5,
        status:"ReOpen_Count",
        ticketsRaised:sessionStorage.getItem('reopencount')
    }
];
export default TempData;