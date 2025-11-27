import React from 'react';
import JobCard from './JobCard';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Stack
} from '@mui/material';

const JobList = ({
  title,
  jobs,
  onDragStart,
  emptyMessage = "No jobs available",
  onJobDrop, // New prop for handling dropped jobs
  acceptDrop = false // New prop to enable drop zone
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e) => {
    if (acceptDrop) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    if (acceptDrop) {
      e.preventDefault();
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    if (acceptDrop && onJobDrop) {
      e.preventDefault();
      setIsDragOver(false);

      try {
        const jobData = JSON.parse(e.dataTransfer.getData('application/json'));
        onJobDrop(jobData);
      } catch (error) {
        console.error('Error parsing dropped job data:', error);
      }
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        border: acceptDrop && isDragOver ? '2px dashed #1976d2' : 'none',
        backgroundColor: acceptDrop && isDragOver ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <Typography variant="h6">
          {title}
        </Typography> */}
         <Typography variant="body2" color="text.secondary">
          Total: {jobs.length} orders
        </Typography>
        {acceptDrop && (
          <Typography variant="caption" color="primary" display="block" gutterBottom>
            Drop jobs here to unschedule
          </Typography>
        )}
      </Box>

        <Box sx={{
          maxHeight: 400,
          overflowY: 'auto',
          mt: 2
        }}>
          {jobs.length === 0 ? (
            <Paper sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: acceptDrop ? 'grey.50' : 'background.default',
              border: acceptDrop ? '2px dashed' : 'none',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                {emptyMessage}
              </Typography>
              {acceptDrop && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Drag jobs from calendar to add them here
                </Typography>
              )}
            </Paper>
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onDragStart={onDragStart}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobList;