import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { toast } from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FDB462', '#B3DE69'];

const IdeathonStatistics = () => {
    const [techStackData, setTechStackData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTechStackData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
                const response = await axios.get(
                    `${API_BASE}/api/charts/tech-stack-distribution`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setTechStackData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching tech stack data:', error);
                toast.error('Failed to load tech stack distribution');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTechStackData();
    }, []);

    const renderActiveShape = (props) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g>
                <path
                    d={`M ${cx},${cy} L ${cx + outerRadius},${cy} A${outerRadius},${outerRadius} 0 0,1 ${cx + Math.cos(endAngle) * outerRadius},${cy + Math.sin(endAngle) * outerRadius} Z`}
                    fill={fill}
                    opacity={0.7}
                />
            </g>
        );
    };

    return (
        <div className="bg-gray-900/95 rounded-xl p-6 mt-4">
            <h2 className="text-xl font-bold text-white mb-6">Ideathon Statistics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Status Bar Chart */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Registration Status</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { status: 'Not Started', count: 5 },
                                    { status: 'In Progress', count: 8 },
                                    { status: 'Testing', count: 3 },
                                    { status: 'Ready for Submission', count: 4 }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="status" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="count" fill="#4f46e5" name="Number of Projects" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tech Stack Distribution Pie Chart */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Tech Stack Distribution</h3>
                    <div className="h-80">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={techStackData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={130}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        activeShape={renderActiveShape}
                                    >
                                        {techStackData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            color: '#fff'
                                        }}
                                        formatter={(value, name) => [value, name]}
                                    />
                                    <Legend
                                        formatter={(value, entry) => (
                                            <span style={{ color: '#fff' }}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeathonStatistics;