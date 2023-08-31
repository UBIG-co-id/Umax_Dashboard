import ReactApexChart from "react-apexcharts";

export default function Chart() {

    const series = [{
        name: 'Amount Spent',
        data: [60, 110, 60, 50, 70, 30, 110]
    }, {
        name: 'RAR',
        data: [60, 50, 30, 37, 90, 40, 20]
    },
    {
        name: 'CTR',
        data: [20, 40, 60, 40, 40, 28, 51]
    }
    
    ];

    // line area chart
    const option = {
        chart: {
            height: 'auto',
            type: 'area',
            group: 'social',
            width: '100%',
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#008FFB', '#FEB019', '#00E396'],
        legend: {
            show: false
        },
    }

    return (
        <div className='w-full h-fit'>
            <ReactApexChart options={option} series={series} type="area" height={'350px'} />
        </div>
    )

}