export interface Study {
  id: string;
  title: string;
  description: string;
  credits: number;
  duration: string;
  location: string;
  room: string;
  type: 'In-Person' | 'Online';
  status: 'Active' | 'Pending' | 'Completed';
  maxParticipants: number;
  currentParticipants: number;
  dateRange?: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: number;
  total: number;
}

export const mockStudies: Study[] = [
  {
    id: '1',
    title: 'Consumer Behavior Study',
    description: 'A comprehensive study examining consumer behavior patterns in retail environments.',
    credits: 2,
    duration: '45-60 minutes',
    location: 'McMurran Hall',
    room: 'Room 204',
    type: 'In-Person',
    status: 'Active',
    maxParticipants: 30,
    currentParticipants: 25,
    dateRange: 'Dec 5-15, 2025',
    timeSlots: [
      { id: '1a', date: 'Monday, Dec 9', time: '10:00 AM', available: 2, total: 5 },
      { id: '1b', date: 'Monday, Dec 9', time: '2:00 PM', available: 3, total: 5 },
      { id: '1c', date: 'Tuesday, Dec 10', time: '9:00 AM', available: 4, total: 5 },
    ],
  },
  {
    id: '2',
    title: 'Sleep Pattern Research',
    description: 'A comprehensive study examining sleep patterns and their impact on cognitive performance.',
    credits: 3,
    duration: '45-60 minutes',
    location: 'McMurran Hall',
    room: 'Room 204',
    type: 'In-Person',
    status: 'Active',
    maxParticipants: 25,
    currentParticipants: 13,
    dateRange: 'Dec 9-15, 2025',
    timeSlots: [
      { id: '2a', date: 'Monday, Dec 9', time: '10:00 AM', available: 4, total: 5 },
      { id: '2b', date: 'Monday, Dec 9', time: '2:00 PM', available: 5, total: 5 },
      { id: '2c', date: 'Monday, Dec 9', time: '4:00 PM', available: 3, total: 5 },
      { id: '2d', date: 'Tuesday, Dec 10', time: '9:00 AM', available: 5, total: 5 },
      { id: '2e', date: 'Tuesday, Dec 10', time: '1:00 PM', available: 5, total: 5 },
      { id: '2f', date: 'Tuesday, Dec 10', time: '3:00 PM', available: 5, total: 5 },
    ],
  },
  {
    id: '3',
    title: 'Cognitive Performance Test',
    description: 'An evaluation of cognitive performance under various environmental conditions.',
    credits: 2.5,
    duration: '45-60 minutes',
    location: 'McMurran Hall',
    room: 'Room 204',
    type: 'In-Person',
    status: 'Active',
    maxParticipants: 20,
    currentParticipants: 15,
    dateRange: 'Dec 6-15, 2025',
    timeSlots: [
      { id: '3a', date: 'Wednesday, Dec 11', time: '10:00 AM', available: 2, total: 4 },
      { id: '3b', date: 'Wednesday, Dec 11', time: '2:00 PM', available: 3, total: 4 },
    ],
  },
  {
    id: '4',
    title: 'Social Media Usage Analysis',
    description: 'Research on social media usage patterns and their psychological effects.',
    credits: 1.5,
    duration: '45-60 minutes',
    location: 'McMurran Hall',
    room: 'Room 204',
    type: 'In-Person',
    status: 'Active',
    maxParticipants: 40,
    currentParticipants: 32,
    dateRange: 'Dec 1-20, 2025',
    timeSlots: [
      { id: '4a', date: 'Thursday, Dec 12', time: '11:00 AM', available: 5, total: 8 },
      { id: '4b', date: 'Thursday, Dec 12', time: '3:00 PM', available: 3, total: 8 },
    ],
  },
  {
    id: '5',
    title: 'Decision Making Under Stress',
    description: 'Examining how stress affects decision-making processes.',
    credits: 3,
    duration: '60-90 minutes',
    location: 'McMurran Hall',
    room: 'Room 305',
    type: 'In-Person',
    status: 'Active',
    maxParticipants: 15,
    currentParticipants: 10,
    timeSlots: [
      { id: '5a', date: 'Friday, Dec 13', time: '10:00 AM', available: 3, total: 5 },
      { id: '5b', date: 'Friday, Dec 13', time: '2:00 PM', available: 2, total: 5 },
    ],
  },
];

export const mockStudent = {
  id: 'S001',
  name: 'Alex Johnson',
  email: 'student@university.edu',
  studentId: '110183',
  course: 'PSYCH 200',
  role: 'student' as const,
  credits: 12,
  activeStudies: 3,
  availableCredits: 25,
  registeredStudies: ['1', '2'],
};

export const mockAdmin = {
  id: 'A001',
  name: 'Dr. Smith',
  email: 'admin@university.edu',
  role: 'admin' as const,
};
