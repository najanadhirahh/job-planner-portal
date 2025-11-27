import { JOB_STATUS, PRIORITY_LEVELS } from '../types/job.js';

export const PRODUCTION_LINES = [
  { id: 'assorted', name: 'Assorted', dailyCapacity: 17.5 },
  { id: 'packaging', name: 'Packaging', dailyCapacity: 20.0 },
  { id: 'assembly', name: 'Assembly', dailyCapacity: 15.0 },
  { id: 'quality', name: 'Quality Control', dailyCapacity: 12.0 },
];

export const SAMPLE_JOBS = [
  {
    id: 'job-001',
    name: 'Widget Assembly A',
    customer: 'ABC Corp',
    requiredHours: 8.5,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    deadline: '2025-11-30',
    status: JOB_STATUS.UNFIRMED,
    productionLine: 'assorted'
  },
  {
    id: 'job-002',
    name: 'Component Testing B',
    customer: 'XYZ Industries',
    requiredHours: 6.0,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    deadline: '2025-12-05',
    status: JOB_STATUS.UNFIRMED,
    productionLine: 'assorted'
  },
  {
    id: 'job-003',
    name: 'Quality Inspection C',
    customer: 'DEF Manufacturing',
    requiredHours: 4.5,
    priorityLevel: PRIORITY_LEVELS.LOW,
    deadline: '2025-12-10',
    status: JOB_STATUS.UNFIRMED,
    productionLine: 'quality'
  },
  {
    id: 'job-004',
    name: 'Package Processing D',
    customer: 'GHI Logistics',
    requiredHours: 12.0,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    deadline: '2025-11-28',
    status: JOB_STATUS.FIRMED,
    scheduledDate: '2025-10-29',
    productionLine: 'packaging'
  },
  {
    id: 'job-005',
    name: 'Final Assembly E',
    customer: 'JKL Systems',
    requiredHours: 9.5,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    deadline: '2025-12-01',
    status: JOB_STATUS.FIRMED,
    scheduledDate: '2025-10-30',
    productionLine: 'assembly'
  }
];

export const getJobsFromStorage = () => {
  const stored = localStorage.getItem('job_planner_jobs');
  return stored ? JSON.parse(stored) : SAMPLE_JOBS;
};

export const saveJobsToStorage = (jobs) => {
  localStorage.setItem('job_planner_jobs', JSON.stringify(jobs));
};

export const calculateDayCapacity = (date, jobs, productionLine) => {
  const dayJobs = jobs.filter(job => 
    job.scheduledDate === date && 
    job.productionLine === productionLine
  );
  
  const scheduledHours = dayJobs.reduce((sum, job) => sum + job.requiredHours, 0);
  const line = PRODUCTION_LINES.find(pl => pl.id === productionLine);
  const totalCapacity = line?.dailyCapacity || 17.5;
  const utilization = Math.round((scheduledHours / totalCapacity) * 100);

  return {
    date,
    scheduledHours,
    totalCapacity,
    utilization,
    jobs: dayJobs
  };
};

export const getCapacityColor = (utilization) => {
  if (utilization <= 60) return 'success';
  if (utilization <= 85) return 'warning';
  return 'error';
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case PRIORITY_LEVELS.HIGH: return 'error';
    case PRIORITY_LEVELS.MEDIUM: return 'warning';
    case PRIORITY_LEVELS.LOW: return 'success';
    default: return 'default';
  }
};