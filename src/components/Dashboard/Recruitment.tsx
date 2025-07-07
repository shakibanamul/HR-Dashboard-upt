import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Video, Calendar, Clock, Users, MapPin, Phone, Mail, Star, CheckCircle, AlertCircle, X, Save, ExternalLink } from 'lucide-react';
import { mockRecruitmentData } from '../../data/mockData';

interface Position {
  id: string;
  position: string;
  department: string;
  applicants: number;
  stage: 'applied' | 'screening' | 'interview' | 'hired' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
}

interface Interview {
  id: string;
  positionId: string;
  candidateName: string;
  candidateEmail: string;
  interviewType: 'zoom' | 'in-person' | 'phone';
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  interviewers: string[];
  meetingLink?: string;
  notes?: string;
  rating?: number;
}

const Recruitment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [viewType, setViewType] = useState('kanban');
  const [positions, setPositions] = useState<Position[]>([
    ...mockRecruitmentData.map(pos => ({
      ...pos,
      location: 'New York, NY',
      salary: '$60,000 - $80,000',
      type: 'full-time' as const,
      description: 'We are looking for a talented professional to join our team.',
      requirements: ['Bachelor\'s degree', '3+ years experience', 'Strong communication skills'],
      postedDate: '2024-01-15',
      deadline: '2024-02-15'
    }))
  ]);

  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      positionId: '1',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@email.com',
      interviewType: 'zoom',
      scheduledDate: '2024-01-20',
      scheduledTime: '14:00',
      status: 'scheduled',
      interviewers: ['John Doe', 'Jane Smith'],
      meetingLink: 'https://zoom.us/j/123456789',
      rating: 4
    },
    {
      id: '2',
      positionId: '2',
      candidateName: 'Michael Chen',
      candidateEmail: 'michael.c@email.com',
      interviewType: 'in-person',
      scheduledDate: '2024-01-22',
      scheduledTime: '10:30',
      status: 'scheduled',
      interviewers: ['Alice Brown'],
      notes: 'Technical interview for Product Manager role'
    },
    {
      id: '3',
      positionId: '1',
      candidateName: 'Emily Davis',
      candidateEmail: 'emily.d@email.com',
      interviewType: 'zoom',
      scheduledDate: '2024-01-18',
      scheduledTime: '16:00',
      status: 'completed',
      interviewers: ['John Doe'],
      meetingLink: 'https://zoom.us/j/987654321',
      rating: 5,
      notes: 'Excellent candidate, strong technical skills'
    }
  ]);

  const [formData, setFormData] = useState({
    position: '',
    department: '',
    location: '',
    salary: '',
    type: 'full-time',
    priority: 'medium',
    description: '',
    requirements: '',
    deadline: ''
  });

  const [interviewForm, setInterviewForm] = useState({
    candidateName: '',
    candidateEmail: '',
    interviewType: 'zoom',
    scheduledDate: '',
    scheduledTime: '',
    interviewers: '',
    notes: ''
  });

  const stages = ['applied', 'screening', 'interview', 'hired', 'rejected'];
  const departments = ['Engineering', 'Marketing', 'Finance', 'Sales', 'HR', 'Operations', 'Product'];
  
  const stageColors = {
    applied: 'bg-blue-100 text-blue-800 border-blue-200',
    screening: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    interview: 'bg-purple-100 text-purple-800 border-purple-200',
    hired: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const interviewTypeIcons = {
    zoom: <Video className="h-4 w-4" />,
    'in-person': <MapPin className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />
  };

  const filteredPositions = positions.filter(position => 
    position.position.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStage === 'all' || position.stage === filterStage) &&
    (filterDepartment === 'all' || position.department === filterDepartment)
  );

  const stageStats = stages.map(stage => ({
    stage,
    count: positions.filter(pos => pos.stage === stage).length
  }));

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' && 
    new Date(`${interview.scheduledDate}T${interview.scheduledTime}`) > new Date()
  ).sort((a, b) => 
    new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime() - 
    new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime()
  );

  const todayInterviews = interviews.filter(interview => 
    interview.scheduledDate === new Date().toISOString().split('T')[0] &&
    interview.status === 'scheduled'
  );

  const handleAddPosition = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPosition: Position = {
      id: Date.now().toString(),
      position: formData.position,
      department: formData.department,
      location: formData.location,
      salary: formData.salary,
      type: formData.type as 'full-time' | 'part-time' | 'contract',
      priority: formData.priority as 'high' | 'medium' | 'low',
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      postedDate: new Date().toISOString().split('T')[0],
      deadline: formData.deadline,
      applicants: 0,
      stage: 'applied'
    };

    setPositions([...positions, newPosition]);
    setShowAddModal(false);
    resetForm();
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInterview: Interview = {
      id: Date.now().toString(),
      positionId: selectedPosition || '',
      candidateName: interviewForm.candidateName,
      candidateEmail: interviewForm.candidateEmail,
      interviewType: interviewForm.interviewType as 'zoom' | 'in-person' | 'phone',
      scheduledDate: interviewForm.scheduledDate,
      scheduledTime: interviewForm.scheduledTime,
      status: 'scheduled',
      interviewers: interviewForm.interviewers.split(',').map(name => name.trim()),
      notes: interviewForm.notes,
      meetingLink: interviewForm.interviewType === 'zoom' ? generateZoomLink() : undefined
    };

    setInterviews([...interviews, newInterview]);
    setShowInterviewModal(false);
    resetInterviewForm();
  };

  const generateZoomLink = () => {
    const meetingId = Math.floor(Math.random() * 1000000000);
    return `https://zoom.us/j/${meetingId}`;
  };

  const resetForm = () => {
    setFormData({
      position: '',
      department: '',
      location: '',
      salary: '',
      type: 'full-time',
      priority: 'medium',
      description: '',
      requirements: '',
      deadline: ''
    });
  };

  const resetInterviewForm = () => {
    setInterviewForm({
      candidateName: '',
      candidateEmail: '',
      interviewType: 'zoom',
      scheduledDate: '',
      scheduledTime: '',
      interviewers: '',
      notes: ''
    });
  };

  const joinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const getInterviewStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recruitment Pipeline</h2>
          <p className="text-sm text-gray-600 mt-1">Manage positions, candidates, and interviews</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="kanban">Kanban View</option>
            <option value="list">List View</option>
            <option value="interviews">Interviews</option>
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stageStats.map(({ stage, count }) => (
          <div key={stage} 
               className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
               onClick={() => setFilterStage(stage)}>
            <div className="text-2xl font-bold text-gray-900">{count}</div>
            <div className="text-xs sm:text-sm text-gray-600 capitalize">{stage}</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${positions.length > 0 ? (count / positions.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Interviews Alert */}
      {todayInterviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Today's Interviews ({todayInterviews.length})</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayInterviews.map(interview => (
              <div key={interview.id} className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{interview.candidateName}</span>
                  <span className="text-sm text-gray-600">{interview.scheduledTime}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  {interviewTypeIcons[interview.interviewType]}
                  <span className="capitalize">{interview.interviewType}</span>
                </div>
                {interview.meetingLink && (
                  <button
                    onClick={() => joinMeeting(interview.meetingLink!)}
                    className="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Video size={14} />
                    <span>Join Meeting</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
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

      {/* Main Content */}
      {viewType === 'kanban' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Kanban</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
            {stages.map(stage => (
              <div key={stage} className="bg-gray-50 rounded-lg p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 capitalize">{stage}</h4>
                  <span className="text-sm text-gray-500">
                    {filteredPositions.filter(pos => pos.stage === stage).length}
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPositions
                    .filter(pos => pos.stage === stage)
                    .map(position => (
                      <div key={position.id} 
                           className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-gray-900 text-sm line-clamp-2 pr-2">{position.position}</h5>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[position.priority]}`}>
                            {position.priority}
                          </span>
                        </div>
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin size={12} />
                            <span className="truncate">{position.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users size={12} />
                            <span>{position.applicants} applicants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>Due: {new Date(position.deadline).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{position.salary}</span>
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={() => {
                                setSelectedPosition(position.id);
                                setShowInterviewModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Schedule Interview"
                            >
                              <Calendar size={14} />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800 p-1" title="View Details">
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewType === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 min-w-[200px]">Position</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden sm:table-cell">Department</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Applicants</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Stage</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden md:table-cell">Priority</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900 hidden lg:table-cell">Deadline</th>
                  <th className="text-left p-3 sm:p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPositions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 sm:p-4">
                      <div>
                        <div className="font-medium text-gray-900 truncate">{position.position}</div>
                        <div className="text-sm text-gray-500 truncate">{position.location}</div>
                        <div className="text-xs text-blue-600 sm:hidden">{position.department}</div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {position.department}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-900">{position.applicants}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageColors[position.stage]}`}>
                        {position.stage}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[position.priority]}`}>
                        {position.priority}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-900 text-sm hidden lg:table-cell">
                      {new Date(position.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedPosition(position.id);
                            setShowInterviewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm p-1"
                          title="Schedule Interview"
                        >
                          <Calendar size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm p-1" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm p-1 hidden sm:inline" title="Edit">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewType === 'interviews' && (
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
              <button 
                onClick={() => setShowInterviewModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
              >
                <Plus size={16} />
                <span>Schedule Interview</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingInterviews.map(interview => {
                const position = positions.find(p => p.id === interview.positionId);
                return (
                  <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{interview.candidateName}</h4>
                        <p className="text-sm text-gray-600">{position?.position}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInterviewStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{interview.scheduledTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {interviewTypeIcons[interview.interviewType]}
                        <span className="capitalize">{interview.interviewType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users size={14} />
                        <span>{interview.interviewers.join(', ')}</span>
                      </div>
                    </div>

                    {interview.rating && (
                      <div className="flex items-center space-x-1 mb-3">
                        {getRatingStars(interview.rating)}
                        <span className="text-sm text-gray-600 ml-2">{interview.rating}/5</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      {interview.meetingLink && (
                        <button
                          onClick={() => joinMeeting(interview.meetingLink!)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Video size={14} />
                          <span>Join Meeting</span>
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-800 p-2">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Interviews */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completed Interviews</h3>
            <div className="space-y-3">
              {interviews.filter(i => i.status === 'completed').map(interview => {
                const position = positions.find(p => p.id === interview.positionId);
                return (
                  <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium text-gray-900">{interview.candidateName}</div>
                        <div className="text-sm text-gray-600">{position?.position}</div>
                      </div>
                      {interview.rating && (
                        <div className="flex items-center space-x-1">
                          {getRatingStars(interview.rating)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{new Date(interview.scheduledDate).toLocaleDateString()}</div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInterviewStatusColor(interview.status)}`}>
                        Completed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">This Month</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">New Applications:</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interviews Conducted:</span>
              <span className="font-medium">{interviews.filter(i => i.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Offers Made:</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hires:</span>
              <span className="font-medium">{positions.filter(p => p.stage === 'hired').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Time to Hire:</span>
              <span className="font-medium">18 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Offer Accept Rate:</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per Hire:</span>
              <span className="font-medium">$2,400</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interview Rating:</span>
              <span className="font-medium">4.2/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h4>
          <div className="space-y-3">
            {upcomingInterviews.slice(0, 3).map(interview => (
              <div key={interview.id} className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 text-sm">{interview.candidateName}</div>
                <div className="text-sm text-blue-700">
                  {new Date(interview.scheduledDate).toLocaleDateString()} • {interview.scheduledTime}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  {interviewTypeIcons[interview.interviewType]}
                  <span className="text-xs text-blue-600 capitalize">{interview.interviewType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Position</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddPosition} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
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
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary Range *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $60,000 - $80,000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      required
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Deadline *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience&#10;Strong communication skills"
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
                    <span>Create Position</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={interviewForm.candidateName}
                      onChange={(e) => setInterviewForm({...interviewForm, candidateName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter candidate name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Candidate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={interviewForm.candidateEmail}
                      onChange={(e) => setInterviewForm({...interviewForm, candidateEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="candidate@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Type *
                    </label>
                    <select
                      required
                      value={interviewForm.interviewType}
                      onChange={(e) => setInterviewForm({...interviewForm, interviewType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="zoom">Zoom Meeting</option>
                      <option value="in-person">In-Person</option>
                      <option value="phone">Phone Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={interviewForm.scheduledDate}
                      onChange={(e) => setInterviewForm({...interviewForm, scheduledDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={interviewForm.scheduledTime}
                      onChange={(e) => setInterviewForm({...interviewForm, scheduledTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interviewers *
                    </label>
                    <input
                      type="text"
                      required
                      value={interviewForm.interviewers}
                      onChange={(e) => setInterviewForm({...interviewForm, interviewers: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe, Jane Smith"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm({...interviewForm, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes about the interview..."
                    />
                  </div>
                </div>

                {interviewForm.interviewType === 'zoom' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Zoom Meeting</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      A Zoom meeting link will be automatically generated and sent to the candidate.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowInterviewModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>Schedule Interview</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;