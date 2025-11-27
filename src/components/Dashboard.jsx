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
  const [selectedProductionLine, setSelectedProductionLine] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedJob, setDraggedJob] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [unfirmedJobs, setUnfirmedJobs] = useState([]);
  const [firmedJobs, setFirmedJobs] = useState([]);
  // const [jobs, setJobs] = useState([]); // Your main jobs array
  const allJobs = jobs.filter(job => job.productionLine === selectedProductionLine);

  
  // In your Dashboard component, replace the direct setState calls with:
  useEffect(() => {
    const loadedJobs = getJobsFromStorage();
    setJobs(loadedJobs);
  }, []);

  useEffect(() => {
    // Filter jobs whenever jobs or selectedProductionLine changes
    const filteredFirmedJobs = jobs.filter(job =>
      job.status === JOB_STATUS.FIRMED &&
      (selectedProductionLine === "all" || job.productionLine === selectedProductionLine)
    );

    const filteredUnfirmedJobs = jobs.filter(job =>
      job.status === JOB_STATUS.UNFIRMED &&
      (selectedProductionLine === "all" || job.productionLine === selectedProductionLine)
    );

    setFirmedJobs(filteredFirmedJobs);
    setUnfirmedJobs(filteredUnfirmedJobs);
  }, [jobs, selectedProductionLine]);


  const handleDragStart = (e, job, fromDate = null) => {
    const jobData = {
      ...job,
      originalDate: fromDate,
      draggedFrom: fromDate ? 'calendar' : 'jobList'
    };
    e.dataTransfer.setData('application/json', JSON.stringify(jobData));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedJob(job);
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();

    try {
      const jobData = JSON.parse(e.dataTransfer.getData('application/json'));

      if (jobData.draggedFrom === 'calendar') {
        // Job was dragged from calendar - move to unfirmed
        handleUnfirmedJobDrop(jobData);
      } else {
        // Job was dragged from job list - schedule it
        scheduleJob(jobData, targetDate);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }

    setDraggedJob(null);
  };

  const scheduleJob = (job, targetDate) => {
    const updatedJobs = jobs.map(j =>
      j.id === job.id
        ? {
          ...j,
          scheduledDate: targetDate,
          status: JOB_STATUS.FIRMED
        }
        : j
    );

    setJobs(updatedJobs);
    saveJobsToStorage(updatedJobs);

    enqueueSnackbar(
      `${job.name} has been scheduled for ${new Date(targetDate).toLocaleDateString()}`,
      { variant: 'success' }
    );
  };

  const handleUnfirmedJobDrop = (droppedJob) => {
    const updatedJobs = jobs.map(job =>
      job.id === droppedJob.id
        ? {
          ...job,
          scheduledDate: null,
          status: JOB_STATUS.UNFIRMED
        }
        : job
    );

    setJobs(updatedJobs);
    saveJobsToStorage(updatedJobs);

    enqueueSnackbar(
      `${droppedJob.name} has been moved to unfirmed jobs`,
      { variant: 'info' }
    );
  };


  const handleJobDragStart = (e, job, originalDate) => {
    const jobData = {
      ...job,
      originalDate: originalDate,
      draggedFrom: 'calendar'
    };
    e.dataTransfer.setData('application/json', JSON.stringify(jobData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
  const scheduledJobs = selectedProductionLine === "all" 
  ? jobs.filter(job => job.status === JOB_STATUS.FIRMED)
  : jobs.filter(job => 
      job.status === JOB_STATUS.FIRMED && 
      job.productionLine === selectedProductionLine
    );

  const totalScheduledHours = scheduledJobs.reduce((sum, job) => sum + job.requiredHours, 0);
  const selectedLine = PRODUCTION_LINES.find(line => line.id === selectedProductionLine);

  // Calculate total capacity for all lines if "all" is selected
  const monthlyCapacity = selectedProductionLine === "all" 
    ? PRODUCTION_LINES.reduce((sum, line) => sum + line.dailyCapacity, 0) * 30
    : selectedLine ? selectedLine.dailyCapacity * 30 : 525;

  const capacityUtilization = Math.round((totalScheduledHours / monthlyCapacity) * 100);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ backgroundColor: '#0077b6' }}>
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
                  <MenuItem value="all">
                    All
                  </MenuItem>
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
                onDragStart={(e, job) => handleDragStart(e, job)} // No fromDate for job list
                onJobDrop={handleUnfirmedJobDrop}
                acceptDrop={true}
                emptyMessage="Drag jobs from calendar to unschedule them"
              />
            )}

            {activeTab === 1 && (
              <JobList
                title="Firmed Job"
                jobs={firmedJobs}
                onDragStart={(e, job) => handleDragStart(e, job)} // No fromDate for job list
                acceptDrop={false}
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
                <Grid container>
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md
                      key={day}
                      sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5',
                        py: 1,
                        border: '1px solid #e0e0e0',
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
                        {day.substring(0, 3)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Grid container>
                  {calendarDays.map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
                    
                    const capacity = calculateDayCapacity(
                      dateString, 
                      jobs, 
                      selectedProductionLine === "all" ? null : selectedProductionLine
                    );

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 0.5
                        }}
                      >
                        <CalendarDay
                          date={date}
                          capacity={capacity}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={handleDayClick}
                          handleJobDragStart={handleJobDragStart}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
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