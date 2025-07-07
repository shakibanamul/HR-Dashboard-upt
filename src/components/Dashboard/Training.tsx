import React, { useState } from 'react';
import { BookOpen, Users, Clock, Award } from 'lucide-react';
import Chart from '../Common/Chart';
import { mockTrainingData } from '../../data/mockData';

const Training: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [...new Set(mockTrainingData.map(course => course.category))];
  
  const filteredCourses = selectedCategory === 'all' 
    ? mockTrainingData 
    : mockTrainingData.filter(course => course.category === selectedCategory);

  const totalEnrolled = mockTrainingData.reduce((sum, course) => sum + course.enrolled, 0);
  const totalCompleted = mockTrainingData.reduce((sum, course) => sum + course.completed, 0);
  const completionRate = Math.round((totalCompleted / totalEnrolled) * 100);

  const enrollmentData = mockTrainingData.map(course => ({
    label: course.courseName.split(' ').slice(0, 2).join(' '),
    value: course.enrolled
  }));

  const completionData = mockTrainingData.map(course => ({
    label: course.courseName.split(' ').slice(0, 2).join(' '),
    value: Math.round((course.completed / course.enrolled) * 100)
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Training & Development</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <span className="hidden sm:inline">Add Course</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Training Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{mockTrainingData.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{totalEnrolled}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">8 weeks</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Training Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollment</h3>
          <Chart data={enrollmentData} type="bar" height={300} color="#3B82F6" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rates</h3>
          <Chart data={completionData} type="line" height={300} color="#10B981" />
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Courses</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 truncate pr-2">{course.courseName}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.category}
                    </span>
                    <span className="text-sm text-gray-600">{course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enrolled:</span>
                  <span className="font-medium">{course.enrolled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-medium">{course.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate:</span>
                  <span className="font-medium">{Math.round((course.completed / course.enrolled) * 100)}%</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{course.completed}/{course.enrolled}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium hidden sm:inline">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Training by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(category => {
            const categoryData = mockTrainingData.filter(course => course.category === category);
            const categoryEnrolled = categoryData.reduce((sum, course) => sum + course.enrolled, 0);
            const categoryCompleted = categoryData.reduce((sum, course) => sum + course.completed, 0);
            const categoryRate = Math.round((categoryCompleted / categoryEnrolled) * 100);

            return (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{categoryData.length}</div>
                <div className="text-sm text-gray-600 mb-2 truncate">{category}</div>
                <div className="text-sm text-gray-600">{categoryEnrolled} enrolled</div>
                <div className="text-sm font-medium text-green-600">{categoryRate}% completed</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${categoryRate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Training */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Training Sessions</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 rounded-lg space-y-2 sm:space-y-0">
            <div>
              <div className="font-medium text-blue-900">Advanced Leadership Workshop</div>
              <div className="text-sm text-blue-700">January 15, 2024 • 9:00 AM - 5:00 PM</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-700">12 registered</div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50 rounded-lg space-y-2 sm:space-y-0">
            <div>
              <div className="font-medium text-green-900">Technical Skills Assessment</div>
              <div className="text-sm text-green-700">January 18, 2024 • 2:00 PM - 4:00 PM</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-700">8 registered</div>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-purple-50 rounded-lg space-y-2 sm:space-y-0">
            <div>
              <div className="font-medium text-purple-900">Communication Excellence</div>
              <div className="text-sm text-purple-700">January 22, 2024 • 10:00 AM - 12:00 PM</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-700">15 registered</div>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;