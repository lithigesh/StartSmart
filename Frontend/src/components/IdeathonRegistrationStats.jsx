import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const IdeathonRegistrationStats = ({ registrations = [], techStack }) => {
    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Process registrations by date
    const registrationsByDate = (registrations || []).reduce((acc, reg) => {
        if (!reg.ideathon?.startDate) return acc;
        const startDate = new Date(reg.ideathon.startDate);
        const formattedDate = formatDate(startDate);
        acc[formattedDate] = acc[formattedDate] || { 
            registrations: 0, 
            participants: 0,
            rawDate: startDate // Store raw date for sorting
        };
        acc[formattedDate].registrations += 1;
        acc[formattedDate].participants += reg.teamMembers?.length || 1;
        return acc;
    }, {});

    // Sort dates and prepare chart data
    const sortedDates = Object.keys(registrationsByDate)
        .sort((a, b) => registrationsByDate[a].rawDate - registrationsByDate[b].rawDate);
    const registrationData = sortedDates.map(date => registrationsByDate[date].registrations);
    const participantData = sortedDates.map(date => registrationsByDate[date].participants);

    // Process tech stack data from registrations and current registration
    const techStackData = (registrations || []).reduce((acc, reg) => {
        if (reg.techStack) {
            // Handle array or string format
            const technologies = Array.isArray(reg.techStack)
                ? reg.techStack
                : reg.techStack.split(',');
            
            technologies.forEach(tech => {
                const cleanTech = tech.trim();
                if (cleanTech) {
                    acc[cleanTech] = (acc[cleanTech] || 0) + 1;
                }
            });
        }
        return acc;
    }, {});

    // Add current registration's tech stack if provided
    if (techStack) {
        const currentTechs = Array.isArray(techStack)
            ? techStack
            : techStack.split(',');
            
        currentTechs.forEach(tech => {
            const cleanTech = tech.trim();
            if (cleanTech) {
                techStackData[cleanTech] = (techStackData[cleanTech] || 0) + 1;
            }
        });
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Ideathon Registration Statistics by Start Date',
                color: 'rgba(255, 255, 255, 0.9)',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            }
        }
    };

    const data = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Total Registrations',
                data: registrationData,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgba(53, 162, 235, 0.8)',
                borderWidth: 1
            },
            {
                label: 'Total Participants',
                data: participantData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 0.8)',
                borderWidth: 1
            }
        ]
    };

    // Tech stack pie chart data and options
    const pieData = {
        labels: Object.keys(techStackData),
        datasets: [
            {
                data: Object.values(techStackData),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',   // Blue
                    'rgba(75, 192, 192, 0.8)',   // Teal
                    'rgba(153, 102, 255, 0.8)',  // Purple
                    'rgba(255, 159, 64, 0.8)',   // Orange
                    'rgba(255, 99, 132, 0.8)',   // Pink
                    'rgba(255, 205, 86, 0.8)',   // Yellow
                    'rgba(76, 175, 80, 0.8)',    // Green
                    'rgba(233, 30, 99, 0.8)',    // Deep Pink
                    'rgba(156, 39, 176, 0.8)',   // Deep Purple
                    'rgba(121, 85, 72, 0.8)'     // Brown
                ],
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        ]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    font: {
                        size: 12,
                        family: 'system-ui'
                    },
                    padding: 20,
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return datasets[0].data.map((value, index) => ({
                            text: `${chart.data.labels[index]} (${value})`,
                            fillStyle: datasets[0].backgroundColor[index],
                            hidden: false,
                            index: index
                        }));
                    }
                }
            },
            title: {
                display: true,
                text: 'Tech Stack Distribution',
                color: 'rgba(255, 255, 255, 0.9)',
                font: {
                    size: 16,
                    family: 'system-ui',
                    weight: 'bold'
                },
                padding: {
                    bottom: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-white/5 rounded-lg p-4 space-y-6">
            <div className="h-[300px]">
                <Bar options={options} data={data} />
            </div>
            <div className="h-[300px]">
                <Pie options={pieOptions} data={pieData} />
            </div>
        </div>
    );
};

export default IdeathonRegistrationStats;