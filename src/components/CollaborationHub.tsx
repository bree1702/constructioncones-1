import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Share2, Bell, UserPlus, Activity } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  lastActive: Date;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  zone?: string;
}

interface CollaborationHubProps {
  onInviteTeam: () => void;
}

export function CollaborationHub({ onInviteTeam }: CollaborationHubProps) {
  const [showHub, setShowHub] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Site Manager',
      status: 'online',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      role: 'Safety Inspector',
      status: 'busy',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastActive: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      name: 'Emma Thompson',
      role: 'Traffic Coordinator',
      status: 'online',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastActive: new Date(Date.now() - 120000)
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      user: 'Sarah Chen',
      action: 'Added 5 warning cones to Zone A',
      timestamp: new Date(Date.now() - 180000),
      zone: 'Zone A'
    },
    {
      id: '2',
      user: 'Mike Rodriguez',
      action: 'Completed safety inspection',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      user: 'Emma Thompson',
      action: 'Updated detour route',
      timestamp: new Date(Date.now() - 420000),
      zone: 'Zone B'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowHub(!showHub)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
              <p className="text-sm text-gray-500">
                {teamMembers.filter(m => m.status === 'online').length} online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {teamMembers.slice(0, 3).map((member) => (
                <div key={member.id} className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
              ))}
            </div>
            <motion.div
              animate={{ rotate: showHub ? 180 : 0 }}
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
        {showHub && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Team Members</h4>
                  <button
                    onClick={onInviteTeam}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTimeAgo(member.lastActive)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Recent Activity</h4>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="font-medium text-gray-900">{activity.user}</div>
                      <div className="text-gray-600">{activity.action}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}