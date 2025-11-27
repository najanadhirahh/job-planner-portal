import React from 'react';
import { getPriorityColor } from '../utils/jobUtils';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Person as UserIcon,
  Inventory as PackageIcon
} from '@mui/icons-material';

const DayDetailModal = ({
  isOpen,
  onClose,
  date,
  jobs,
  totalHours,
  capacity,
  utilization
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getUtilizationColor = (util) => {
    if (util <= 60) return 'success';
    if (util <= 85) return 'warning';
    return 'error';
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon />
            <Typography variant="h6">{formattedDate}</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Production schedule and capacity details for this day
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box mb={3}>
          {/* Capacity Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3} textAlign="center">
                <Grid item xs={4}>
                  <Typography variant="h4" color="primary">
                    {jobs.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jobs Scheduled
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" color="primary">
                    {totalHours.toFixed(1)}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Hours
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Chip
                    label={`${utilization}%`}
                    color={getUtilizationColor(utilization)}
                    sx={{ fontSize: '1.5rem', height: 40, px: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Utilization
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
                Capacity: {capacity}h available
              </Typography>
            </CardContent>
          </Card>

          {/* Job List */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PackageIcon />
              <Typography variant="h6">
                Scheduled Jobs ({jobs.length})
              </Typography>
            </Box>
            
            {jobs.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No jobs scheduled for this day
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {jobs.map((job) => (
                  <Card key={job.id} sx={{ borderLeft: '4px solid #1976d2' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {job.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Job ID: {job.id}
                          </Typography>
                        </Box>
                        <Chip 
                          label={job.priorityLevel}
                          color={getPriorityColor(job.priorityLevel)}
                        />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <UserIcon fontSize="small" color="action" />
                            <Typography variant="body2">{job.customer}</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <ClockIcon fontSize="small" color="action" />
                            <Typography variant="body2">{job.requiredHours}h required</Typography>
                          </Box>
                        </Grid>
                        
                        {job.deadline && (
                          <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                Due: {new Date(job.deadline).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailModal;