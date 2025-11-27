import React, { useState } from 'react';
import { getCapacityColor } from '../utils/jobUtils';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const CalendarDay = ({ date, capacity, onDrop, onDragOver, onClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const dateString = date.toISOString().split('T')[0];
  
  const capacityColor = getCapacityColor(capacity.utilization);
  const isToday = new Date().toDateString() === date.toDateString();
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, dateString);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    onDragOver(e);
  };

  return (
    <Card 
      sx={{ 
        height: 170,
        width: 140,
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: isDragOver ? 'primary.light' : 'background.paper',
        '&:hover': {
          boxShadow: 2,
          transform: 'scale(1.02)'
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => onClick?.(dateString)}
    >
      <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box textAlign="center">
            <Typography variant="h6" component="div">
              {dayNumber}
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
              {dayName}
            </Typography> */}
            <Typography variant="caption" color="text.secondary" display="block">
              {monthName}
            </Typography>
          </Box>
          {capacity.jobs.length > 0 && (
            <IconButton size="small">
              <EditIcon fontSize="small" color="action" />
            </IconButton>
          )}
        </Box>
        
        <Box>
          <Chip
            label={`${capacity.scheduledHours.toFixed(1)}h / ${capacity.utilization}%`}
            color={capacityColor}
            size="small"
            sx={{ fontSize: '0.7rem', height: 20, mb: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary" display="block">
            {capacity.totalCapacity}h total
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarDay;