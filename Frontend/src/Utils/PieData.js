const PieData =[
    {
        id:1,
        category:"IT Support",
        ticketsRaised:sessionStorage.getItem('itcount')
    },
    {
        id:2,
        category:"Hardware",
        ticketsRaised:sessionStorage.getItem('hardwarecount')
    },
    {
        id:3,
        category:"Food",
        ticketsRaised:sessionStorage.getItem('foodcount')
    }
];
export default PieData;