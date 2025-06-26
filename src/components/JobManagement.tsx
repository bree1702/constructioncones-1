import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  Users,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Plus
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  supervisor: {
    name: string;
    phone: string;
    email: string;
  };
  location: {
    address: string;
    coordinates: [number, number];
  };
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  teamSize: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface JobManagementProps {
  onJobSelect: (job: Job) => void;
}

export function JobManagement({ onJobSelect }: JobManagementProps) {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Las Vegas Strip Road Maintenance',
      description: 'Major road resurfacing project on Las Vegas Boulevard between Tropicana and Flamingo. Includes lane closures, traffic rerouting, and safety zone establishment.',
      supervisor: {
        name: 'Maria Rodriguez',
        phone: '(702) 555-0123',
        email: 'maria.rodriguez@lvdot.gov'
      },
      location: {
        address: 'Las Vegas Boulevard, Las Vegas, NV',
        coordinates: [36.1069, -115.1739]
      },
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-30'),
      budget: 2500000,
      status: 'active',
      teamSize: 25,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Henderson Bridge Repair',
      description: 'Structural repairs and safety improvements to the Henderson Bridge. Requires partial lane closures and enhanced safety protocols.',
      supervisor: {
        name: 'James Chen',
        phone: '(702) 555-0456',
        email: 'james.chen@henderson.gov'
      },
      location: {
        address: 'Henderson Bridge, Henderson, NV',
        coordinates: [36.0395, -114.9817]
      },
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-15'),
      budget: 850000,
      status: 'planning',
      teamSize: 15,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'North Las Vegas Water Main Replacement',
      description: 'Emergency water main replacement project requiring road excavation and traffic management in residential area.',
      supervisor: {
        name: 'Sarah Thompson',
        phone: '(702) 555-0789',
        email: 'sarah.thompson@nlv.gov'
      },
      location: {
        address: 'Cheyenne Avenue, North Las Vegas, NV',
        coordinates: [36.1988, -115.1175]
      },
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-28'),
      budget: 450000,
      status: 'active',
      teamSize: 12,
      priority: 'urgent'
    }
  ]);

  const [showJobs, setShowJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showNewJobForm, setShowNewJobForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'planning': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'on-hold': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowJobs(!showJobs)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Job Management</h3>
              <p className="text-sm text-gray-500">
                {jobs.filter(j => j.status === 'active').length} active jobs
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNewJobForm(true);
              }}
              className="p-2 text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
            </button>
            <motion.div
              animate={{ rotate: showJobs ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showJobs && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Job Statistics */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600">
                    {jobs.filter(j => j.status === 'active').length}
                  </div>
                  <div className="text-xs text-green-700">Active</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {jobs.filter(j => j.status === 'planning').length}
                  </div>
                  <div className="text-xs text-blue-700">Planning</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {jobs.filter(j => j.priority === 'urgent').length}
                  </div>
                  <div className="text-xs text-yellow-700">Urgent</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-purple-600">{jobs.length}</div>
                  <div className="text-xs text-purple-700">Total</div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedJob(job);
                      onJobSelect(job);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                            {job.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{job.supervisor.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{job.location.address}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">
                                {formatDate(job.startDate)} - {formatDate(job.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{formatCurrency(job.budget)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingJob(job);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{job.teamSize} team members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{job.supervisor.phone}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Supervisor</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{selectedJob.supervisor.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedJob.supervisor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedJob.supervisor.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Project Details</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(selectedJob.startDate)} - {formatDate(selectedJob.endDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span>{formatCurrency(selectedJob.budget)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{selectedJob.teamSize} team members</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedJob.location.address}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Coordinates: {selectedJob.location.coordinates[0]}, {selectedJob.location.coordinates[1]}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}