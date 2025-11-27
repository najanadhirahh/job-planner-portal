import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Business as BusinessIcon,
  AccessTime as TimeIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const JobDetailModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'firmed': return 'success';
      case 'unfirmed': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'firmed': return 'Scheduled';
      case 'unfirmed': return 'Unscheduled';
      default: return status;
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <AssignmentIcon color="primary" />
          <Typography variant="h6">{job.name}</Typography>
          <Chip 
            label={getStatusText(job.status)} 
            color={getStatusColor(job.status)}
            size="small"
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" />
                Production Details
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Production Line
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {PRODUCTION_LINES.find(line => line.id === job.productionLine)?.name || job.productionLine}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Required Hours
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {job.requiredHours} hours
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Priority
                </Typography>
                <Typography variant="body1">
                  {job.priority || 'Normal'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" />
                Scheduling
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getStatusText(job.status)}
                </Typography>

                {job.scheduledDate && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Scheduled Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date(job.scheduledDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </>
                )}

                {!job.scheduledDate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Not yet scheduled
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {job.description && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {job.description}
                </Typography>
              </Paper>
            </Grid>
          )}

          {job.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2">
                  {job.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        {job.status === 'unfirmed' && (
          <Button variant="contained" onClick={() => {
            // You can add functionality to quickly schedule this job
            onClose();
          }}>
            Schedule This Job
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default JobDetailModal;