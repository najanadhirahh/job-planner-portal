import React from 'react';
import JobCard from './JobCard';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper
} from '@mui/material';

const JobList = ({ title, jobs, onDragStart, emptyMessage = "No jobs available" }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total: {jobs.length} orders
        </Typography>
        
        <Box sx={{ 
          maxHeight: 400, 
          overflowY: 'auto',
          mt: 2
        }}>
          {jobs.length === 0 ? (
            <Paper sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: 'grey.50'
            }}>
              <Typography variant="body2" color="text.secondary">
                {emptyMessage}
              </Typography>
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