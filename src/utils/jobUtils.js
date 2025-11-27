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
    name: 'Component Testing B',
    customer: 'DEF Manufacturing',
    requiredHours: 3.0,
    priorityLevel: PRIORITY_LEVELS.HIGH,
    deadline: '2025-12-05',
    status: JOB_STATUS.UNFIRMED,
    productionLine: 'assorted'
  },
  {
    id: 'job-002',
    name: 'Component Testing B',
    customer: 'XYZ Industries',
    requiredHours: 3.0,
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
    requiredHours: 2.0,
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
    requiredHours: 1.5,
    priorityLevel: PRIORITY_LEVELS.MEDIUM,
    deadline: '2025-12-01',
    status: JOB_STATUS.FIRMED,
    scheduledDate: '2025-10-30',
    productionLine: 'assembly'
  }
];

export const getJobsFromStorage = () => {
  // const stored = localStorage.getItem('job_planner_jobs');
  return SAMPLE_JOBS;
};

export const saveJobsToStorage = (jobs) => {
  localStorage.setItem('job_planner_jobs', JSON.stringify(jobs));
};

export const calculateDayCapacity = (dateString, jobs, productionLine ) => {
  console.log('productionLine', productionLine);
  console.log('jobs', jobs);
  
  const dayJobs = jobs.filter(job => 
    job.scheduledDate === dateString &&
    (productionLine === "all" || job.productionLine === productionLine)
  );
  
  console.log('dayJobs', dayJobs);
  
  const scheduledHours = dayJobs.reduce((sum, job) => sum + job.requiredHours, 0);
  
  // Calculate total capacity based on production line or all lines
  const totalCapacity = productionLine 
    ? (PRODUCTION_LINES.find(line => line.id === productionLine)?.dailyCapacity || 8)
    : PRODUCTION_LINES.reduce((sum, line) => sum + line.dailyCapacity, 0);
  
  const utilization = totalCapacity > 0 ? Math.round((scheduledHours / totalCapacity) * 100) : 0;
  
  return {
    jobs: dayJobs,
    scheduledHours,
    totalCapacity,
    utilization
  };
};

export const getCapacityColor = (utilization) => {
  console.log('u', utilization);
  
  if (utilization <= 60) return 'success';
  if (utilization <= 85) return 'warning';
  // if (utilization <= 100) return 'info';
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