import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';
import JobList from './JobList';
import CalendarDay from './CalendarDay';
import SummaryCards from './SummaryCards';
import DayDetailModal from './DayDetailModal';
import { JOB_STATUS } from '../types/job';
import { 
  getJobsFromStorage, 
  saveJobsToStorage, 
  calculateDayCapacity, 
  PRODUCTION_LINES 
} from '../utils/jobUtils';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  IconButton,
  Paper
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  
  const [jobs, setJobs] = useState([]);
  const [selectedProductionLine, setSelectedProductionLine] = useState('assorted');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadedJobs = getJobsFromStorage();
    setJobs(loadedJobs);
  }, []);

  const firmedJobs = jobs.filter(job => 
    job.status === JOB_STATUS.FIRMED && 
    job.productionLine === selectedProductionLine
  );
  
  const unfirmedJobs = jobs.filter(job => 
    job.status === JOB_STATUS.UNFIRMED && 
    job.productionLine === selectedProductionLine
  );

  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    
    if (!draggedJob) return;

    const updatedJobs = jobs.map(job => {
      if (job.id === draggedJob.id) {
        return {
          ...job,
          scheduledDate: targetDate,
          status: JOB_STATUS.FIRMED
        };
      }
      return job;
    });

    setJobs(updatedJobs);
    saveJobsToStorage(updatedJobs);
    setDraggedJob(null);

    enqueueSnackbar(
      `${draggedJob.name} has been scheduled for ${new Date(targetDate).toLocaleDateString()}`,
      { variant: 'success' }
    );
  };
  
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  
  const resetToSampleData = () => {
    localStorage.removeItem('job_planner_jobs');
    const sampleJobs = getJobsFromStorage();
    setJobs(sampleJobs);
    enqueueSnackbar('Sample data has been restored', { variant: 'info' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const days = [];

    // Add days from previous month to fill the first week
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Generate 42 days (6 weeks) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Calculate summary statistics
  const scheduledJobs = jobs.filter(job => 
    job.status === JOB_STATUS.FIRMED && 
    job.productionLine === selectedProductionLine
  );
  
  const totalScheduledHours = scheduledJobs.reduce((sum, job) => sum + job.requiredHours, 0);
  const selectedLine = PRODUCTION_LINES.find(line => line.id === selectedProductionLine);
  const monthlyCapacity = selectedLine ? selectedLine.dailyCapacity * 30 : 525;
  const capacityUtilization = Math.round((totalScheduledHours / monthlyCapacity) * 100);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="sticky" sx={{backgroundColor: '#0077b6'}}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              Capacity Planning
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Drag and drop job orders to schedule production
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              Welcome, {user?.username}
            </Typography>
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Left Panel - Job Lists */}
          <Grid item xs={12} lg={3}>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Production Line</InputLabel>
                <Select
                  value={selectedProductionLine}
                  label="Production Line"
                  onChange={(e) => setSelectedProductionLine(e.target.value)}
                >
                  {PRODUCTION_LINES.map(line => (
                    <MenuItem key={line.id} value={line.id}>
                      {line.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Paper sx={{ mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
              >
                <Tab label="Unfirmed Job" />
                <Tab label="Firmed Job" />
              </Tabs>
            </Paper>
            
            {activeTab === 0 && (
              <JobList
                title="Unfirmed Job"
                jobs={unfirmedJobs}
                onDragStart={handleDragStart}
                emptyMessage="All orders scheduled"
              />
            )}
            
            {activeTab === 1 && (
              <JobList
                title="Firmed Job"
                jobs={firmedJobs}
                onDragStart={handleDragStart}
                emptyMessage="No confirmed orders"
              />
            )}
          </Grid>

          {/* Right Panel - Calendar and Summary */}
          <Grid item xs={12} lg={9}>
            {/* Controls */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" gap={1}>
                <Button 
                  variant="outlined" 
                  startIcon={<FilterIcon />}
                  size="small"
                >
                  Filters
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<RefreshIcon />}
                  onClick={resetToSampleData}
                  size="small"
                >
                  Reset Data
                </Button>
              </Box>
              
              <Box display="flex" gap={1}>
                <Button
                  variant={viewMode === 'summary' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode('summary')}
                >
                  Summary
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode('week')}
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'month' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode('month')}
                >
                  Month
                </Button>
              </Box>
            </Box>

            {/* Summary Cards */}
            <SummaryCards
              totalOrders={scheduledJobs.length}
              scheduledHours={totalScheduledHours}
              capacityUtilization={capacityUtilization}
              totalCapacity={monthlyCapacity}
            />

            {/* Calendar Navigation */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <IconButton onClick={() => navigateMonth('prev')}>
                <ChevronLeft />
              </IconButton>
              <Typography variant="h5">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <IconButton onClick={() => navigateMonth('next')}>
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Calendar Grid */}
            <Paper sx={{ p: 2 }}>
              <Grid container>
                
                {calendarDays.map((date, index) => {
                  const dateString = date.toISOString().split('T')[0];
                  const capacity = calculateDayCapacity(dateString, jobs, selectedProductionLine);
                  
                  return (
                    <Grid item md key={index}>
                      <CalendarDay
                        date={date}
                        capacity={capacity}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleDayClick}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          jobs={calculateDayCapacity(selectedDate, jobs, selectedProductionLine).jobs}
          totalHours={calculateDayCapacity(selectedDate, jobs, selectedProductionLine).scheduledHours}
          capacity={calculateDayCapacity(selectedDate, jobs, selectedProductionLine).totalCapacity}
          utilization={calculateDayCapacity(selectedDate, jobs, selectedProductionLine).utilization}
        />
      )}
    </Box>
  );
};

export default Dashboard;