import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Star, X, Save } from 'lucide-react';
import { mockEmployees, Employee } from '../../data/mockData';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    salary: '',
    performanceRating: '',
    attendanceRate: '',
    avatar: ''
  });

  const departments = ['Engineering', 'Marketing', 'Finance', 'Sales', 'HR', 'Operations', 'Product'];

  const filteredEmployees = employees
    .filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(emp => filterDepartment === 'all' || emp.department === filterDepartment)
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Employee];
      let bValue = b[sortBy as keyof Employee];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: '',
      salary: '',
      performanceRating: '',
      attendanceRate: '',
      avatar: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingEmployee(null);
    setShowAddModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      salary: employee.salary.toString(),
      performanceRating: employee.performanceRating.toString(),
      attendanceRate: employee.attendanceRate.toString(),
      avatar: employee.avatar
    });
    setEditingEmployee(employee);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData: Employee = {
      id: editingEmployee ? editingEmployee.id : Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      salary: parseInt(formData.salary),
      performanceRating: parseFloat(formData.performanceRating),
      attendanceRate: parseInt(formData.attendanceRate),
      joinDate: editingEmployee ? editingEmployee.joinDate : new Date().toISOString().split('T')[0],
      status: 'active' as const,
      avatar: formData.avatar || `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`
    };

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? employeeData : emp));
    } else {
      setEmployees([...employees, employeeData]);
    }

    setShowAddModal(false);
    resetForm();
    setEditingEmployee(null);
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setShowDeleteConfirm(null);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Management</h2>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 min-w-[200px]">Employee</th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                  onClick={() => handleSort('department')}
                >
                  Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden md:table-cell">Role</th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 hidden lg:table-cell"
                  onClick={() => handleSort('salary')}
                >
                  Salary {sortBy === 'salary' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden xl:table-cell">Performance</th>
                <th 
                  className="text-left p-3 sm:p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('attendanceRate')}
                >
                  Attendance {sortBy === 'attendanceRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={employee.avatar}
                        alt={employee.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">{employee.name}</div>
                        <div className="text-sm text-gray-500 truncate">{employee.email}</div>
                        <div className="text-xs text-blue-600 sm:hidden">{employee.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 text-gray-900 hidden md:table-cell">{employee.role}</td>
                  <td className="p-3 sm:p-4 text-gray-900 hidden lg:table-cell">${employee.salary.toLocaleString()}</td>
                  <td className="p-3 sm:p-4 hidden xl:table-cell">
                    <div className="flex items-center space-x-1">
                      {getRatingStars(employee.performanceRating)}
                      <span className="text-sm text-gray-600 ml-2">
                        {employee.performanceRating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        employee.attendanceRate >= 95 ? 'bg-green-500' :
                        employee.attendanceRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm text-gray-900">{employee.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openEditModal(employee)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit Employee"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(employee.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</div>
          <div className="text-sm text-gray-600">Total Employees</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {filteredEmployees.length > 0 ? Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / filteredEmployees.length) : 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Attendance</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {filteredEmployees.length > 0 ? (filteredEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / filteredEmployees.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-sm text-gray-600">Avg Performance</div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Role *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter job role"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Salary *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter annual salary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Performance Rating *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.performanceRating}
                      onChange={(e) => setFormData({...formData, performanceRating: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1.0 - 5.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendance Rate (%) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={formData.attendanceRate}
                      onChange={(e) => setFormData({...formData, attendanceRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0 - 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingEmployee ? 'Update Employee' : 'Add Employee'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this employee? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;