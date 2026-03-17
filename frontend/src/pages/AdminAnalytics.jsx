import { useState, useEffect } from "react";
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaUsers, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBuilding
} from "react-icons/fa";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolutionRate: 0,
    averageResolutionTime: 0,
    totalUsers: 0,
    activeDepartments: 0
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setAnalytics({
      totalComplaints: 1247,
      resolvedComplaints: 892,
      pendingComplaints: 156,
      inProgressComplaints: 199,
      resolutionRate: 71.5,
      averageResolutionTime: 3.2,
      totalUsers: 3421,
      activeDepartments: 8
    });

    setMonthlyData([
      { month: "Jan", complaints: 120, resolved: 85 },
      { month: "Feb", complaints: 135, resolved: 98 },
      { month: "Mar", complaints: 142, resolved: 105 },
      { month: "Apr", complaints: 128, resolved: 92 },
      { month: "May", complaints: 156, resolved: 118 },
      { month: "Jun", complaints: 168, resolved: 125 }
    ]);

    setDepartmentData([
      { name: "PWD", total: 456, resolved: 312, pending: 89, inProgress: 55, resolutionRate: 68.4 },
      { name: "Electricity Board", total: 234, resolved: 189, pending: 23, inProgress: 22, resolutionRate: 80.8 },
      { name: "Water Authority", total: 198, resolved: 156, pending: 25, inProgress: 17, resolutionRate: 78.8 },
      { name: "Sanitation", total: 156, resolved: 134, pending: 12, inProgress: 10, resolutionRate: 85.9 },
      { name: "Traffic Police", total: 98, resolved: 78, pending: 8, inProgress: 12, resolutionRate: 79.6 },
      { name: "Parks & Gardens", total: 67, resolved: 45, pending: 12, inProgress: 10, resolutionRate: 67.2 }
    ]);

    setPriorityData([
      { priority: "High", count: 234, percentage: 18.8 },
      { priority: "Medium", count: 567, percentage: 45.5 },
      { priority: "Low", count: 446, percentage: 35.7 }
    ]);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into platform performance and complaint resolution</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.resolutionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Resolution Time</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.averageResolutionTime} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaChartLine className="mr-2" />
              Monthly Trends
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{data.month}</span>
                      <span className="text-sm text-gray-600">{data.complaints} complaints</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(data.complaints / 200) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600">Resolved: {data.resolved}</span>
                      <span className="text-xs text-gray-600">
                        {Math.round((data.resolved / data.complaints) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaChartPie className="mr-2" />
              Priority Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {priorityData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      data.priority === 'High' ? 'bg-red-500' :
                      data.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{data.priority}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{data.count}</span>
                    <span className="text-xs text-gray-600 ml-2">({data.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaBuilding className="mr-2" />
            Department Performance
          </h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentData.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {dept.resolved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {dept.inProgress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {dept.pending}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${dept.resolutionRate}%` }}
                          ></div>
                        </div>
                        <span>{dept.resolutionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
