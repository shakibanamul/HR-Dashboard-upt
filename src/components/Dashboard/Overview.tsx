import React from 'react';
import MetricCard from '../Common/MetricCard';
import Chart from '../Common/Chart';
import { Users, TrendingUp, Calendar, DollarSign, UserCheck, AlertTriangle, Clock, Award, Target, Activity, ChevronRight, Bell, FileText, BarChart3 } from 'lucide-react';
import { mockEmployees, mockAttendanceData, mockRecruitmentData } from '../../data/mockData';

const Overview: React.FC = () => {
  // Calculate dynamic metrics from actual data
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const avgSalary = Math.round(mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / mockEmployees.length);
  const avgAttendance = Math.round(mockEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / mockEmployees.length);
  const openPositions = mockRecruitmentData.filter(pos => pos.stage !== 'hired').length;
  const avgPerformance = mockEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / mockEmployees.length;

  // Calculate additional metrics
  const recentHires = mockEmployees.filter(emp => 
    new Date(emp.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const highPerformers = mockEmployees.filter(emp => emp.performanceRating >= 4.5).length;
  const lowAttendance = mockEmployees.filter(emp => emp.attendanceRate < 90).length;
  const upcomingReviews = mockEmployees.filter(emp => emp.performanceRating < 4.0).length;

  // Dynamic attendance chart data from last 7 days
  const attendanceChartData = mockAttendanceData.slice(-7).map(item => ({
    label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.present
  }));

  // Dynamic department distribution from employee data
  const departmentData = mockEmployees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentChartData = Object.entries(departmentData).map(([dept, count]) => ({
    label: dept.length > 8 ? dept.substring(0, 8) + '...' : dept,
    value: count
  }));

  // Performance trend by department (last 6 months average)
  const performanceTrendData = Object.keys(departmentData).map(dept => {
    const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
    const avgRating = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / deptEmployees.length;
    return {
      label: dept.length > 6 ? dept.substring(0, 6) + '...' : dept,
      value: Math.round(avgRating * 20) // Convert to percentage scale
    };
  });

  // Salary distribution data
  const salaryRanges = [
    { label: '<50K', min: 0, max: 50000 },
    { label: '50-70K', min: 50000, max: 70000 },
    { label: '70-90K', min: 70000, max: 90000 },
    { label: '>90K', min: 90000, max: Infinity }
  ];

  const salaryDistributionData = salaryRanges.map(range => ({
    label: range.label,
    value: mockEmployees.filter(emp => emp.salary >= range.min && emp.salary < range.max).length
  }));

  // Calculate trends (mock calculation for demonstration)
  const calculateTrend = (current: number, previous: number) => ({
    value: previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0,
    isPositive: current > previous
  });

  // Mock previous period data for trend calculation
  const prevTotalEmployees = totalEmployees - 2;
  const prevAvgSalary = avgSalary - 1500;
  const prevAvgAttendance = avgAttendance + 2;
  const prevAvgPerformance = avgPerformance - 0.1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
            <p className="text-blue-100 mt-1">Here's what's happening with your team today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-blue-100">Today</div>
              <div className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric'
              })}</div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Add Employee</div>
              <div className="text-xs text-gray-500">Quick hire</div>
            </div>
          </div>
        </button>
        
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Generate Report</div>
              <div className="text-xs text-gray-500">Export data</div>
            </div>
          </div>
        </button>
        
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Performance</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
          </div>
        </button>
        
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">Analytics</div>
              <div className="text-xs text-gray-500">View trends</div>
            </div>
          </div>
        </button>
      </div>

      {/* Key Metrics - Enhanced Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
          trend={calculateTrend(totalEmployees, prevTotalEmployees)}
          subtitle={`${activeEmployees} active`}
        />
        <MetricCard
          title="Average Salary"
          value={`$${avgSalary.toLocaleString()}`}
          icon={DollarSign}
          trend={calculateTrend(avgSalary, prevAvgSalary)}
        />
        <MetricCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={Calendar}
          trend={calculateTrend(avgAttendance, prevAvgAttendance)}
        />
        <MetricCard
          title="Avg Performance"
          value={avgPerformance.toFixed(1)}
          icon={TrendingUp}
          trend={calculateTrend(avgPerformance, prevAvgPerformance)}
          subtitle="Out of 5.0"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Recent Hires"
          value={recentHires}
          icon={UserCheck}
          subtitle="This month"
        />
        <MetricCard
          title="Open Positions"
          value={openPositions}
          icon={Target}
          subtitle="Active postings"
        />
        <MetricCard
          title="High Performers"
          value={highPerformers}
          icon={Award}
          subtitle="4.5+ rating"
        />
        <MetricCard
          title="Needs Attention"
          value={lowAttendance}
          icon={AlertTriangle}
          subtitle="<90% attendance"
        />
      </div>

      {/* Main Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Weekly Attendance</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              Total: {attendanceChartData.reduce((sum, item) => sum + item.value, 0)} employees
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={attendanceChartData} type="line" height={280} color="#10B981" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              Present
            </span>
            <span>Avg: {Math.round(attendanceChartData.reduce((sum, item) => sum + item.value, 0) / attendanceChartData.length)}</span>
          </div>
        </div>
        
        {/* Department Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Department Distribution</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              {Object.keys(departmentData).length} departments
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={departmentChartData} type="bar" height={280} color="#3B82F6" />
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(departmentData).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="truncate text-gray-700">{dept}</span>
                <span className="font-medium text-blue-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Performance by Department */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Performance by Department</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              Scale: 0-100%
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={performanceTrendData} type="bar" height={250} color="#8B5CF6" />
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Company Average:</span>
              <span className="font-medium">{Math.round(avgPerformance * 20)}%</span>
            </div>
          </div>
        </div>

        {/* Salary Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Salary Distribution</h3>
            <div className="text-xs sm:text-sm text-gray-500">
              Total: {totalEmployees} employees
            </div>
          </div>
          <div className="w-full overflow-hidden">
            <Chart data={salaryDistributionData} type="line" height={250} color="#F59E0B" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {salaryDistributionData.map((range, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-700">{range.label}</span>
                <span className="font-medium text-yellow-600">{range.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Priority Alerts
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {upcomingReviews > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {upcomingReviews} employees need performance reviews
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Schedule reviews to maintain performance standards</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            )}
            
            {lowAttendance > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Clock className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {lowAttendance} employees have low attendance
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Consider reaching out for support or intervention</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            )}
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Monthly payroll processing due in 3 days
                </p>
                <p className="text-xs text-gray-600 mt-1">Ensure all timesheets are submitted and approved</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Team Highlights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Award className="h-5 w-5 mr-2 text-green-500" />
              Team Highlights
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View More</button>
          </div>
          <div className="space-y-4">
            {mockEmployees
              .sort((a, b) => b.performanceRating - a.performanceRating)
              .slice(0, 3)
              .map((employee, index) => (
                <div key={employee.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                    <div className="text-sm text-gray-600 truncate">{employee.department}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-green-600">{employee.performanceRating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">
                      {index === 0 ? '🏆 Top' : index === 1 ? '🥈 2nd' : '🥉 3rd'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Department Performance Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Department Performance Overview</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
            <span>View Details</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(departmentData).map(([dept, count]) => {
            const deptEmployees = mockEmployees.filter(emp => emp.department === dept);
            const avgDeptSalary = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / count);
            const avgDeptPerformance = deptEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / count;
            const avgDeptAttendance = Math.round(deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / count);
            
            return (
              <div key={dept} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-blue-300">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 truncate">{dept}</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{count}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Salary:</span>
                    <span className="font-medium">${avgDeptSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Performance:</span>
                    <span className="font-medium">{avgDeptPerformance.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium">{avgDeptAttendance}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(avgDeptPerformance / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Enhanced with Real Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity & Insights</h3>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {recentHires} new employees joined this month
              </p>
              <p className="text-xs text-gray-500">
                Latest: {mockEmployees
                  .filter(emp => new Date(emp.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                  .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())[0]?.name || 'None this month'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {highPerformers} employees with excellent performance ratings
              </p>
              <p className="text-xs text-gray-500">Top performer: {mockEmployees.sort((a, b) => b.performanceRating - a.performanceRating)[0]?.name}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {lowAttendance} employees need attendance improvement
              </p>
              <p className="text-xs text-gray-500">Average attendance: {avgAttendance}%</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </div>

          <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {openPositions} open positions across {new Set(mockRecruitmentData.filter(pos => pos.stage !== 'hired').map(pos => pos.department)).size} departments
              </p>
              <p className="text-xs text-gray-500">Priority hiring in progress</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;