// In CalendarDay component, replace the entire component with:
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

const CalendarDay = ({ date, capacity, onDrop, onDragOver, onClick, handleJobDragStart }) => {
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

  const handleLocalDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, dateString);
  };

  const handleLocalDragOver = (e) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleJobDragEnd = (e) => {
    // Optional: handle any cleanup after drag ends
  };

  return (
    <Card
      sx={{
        height: { xs: 140, sm: 160, md: 190 },
        width: { xs: '100%', sm: 130, md: 150 },
        maxWidth: '100%',
        cursor: 'pointer',
        boxShadow: isDragOver ? 6 : 1,
        transition: 'all 0.2s',
        border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: isDragOver ? 'primary.light' : 'background.paper',
        '&:hover': {
          boxShadow: 2,
          transform: 'scale(1.02)'
        },
        flex: 1
      }}
      onDrop={handleLocalDrop}
      onDragOver={handleLocalDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={() => onClick?.(dateString)}
    >
      <CardContent sx={{
        p: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:last-child': { pb: 1 }
      }}>
        {/* Top Section - Date and Edit Button */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="div" sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
              {dayNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem' } }}>
              {monthName}
            </Typography>
          </Box>
          {capacity.jobs.length > 0 && (
            <IconButton size="small" sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: '0.8rem', sm: '1rem' } } }}>
              <EditIcon fontSize="small" color="action" />
            </IconButton>
          )}
        </Box>

        {/* Middle Section - Job Names */}
        <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', my: 0.5 }}>
          {capacity.jobs.length > 0 ? (
            <Box sx={{ maxHeight: '100%', overflow: 'auto' }}>
              {capacity.jobs.slice(0, 3).map((job, index) => (
                <Box
                  key={job.id || index}
                  draggable
                  onDragStart={(e) => handleJobDragStart(e, job, dateString)}
                  onDragEnd={handleJobDragEnd}
                  sx={{
                    cursor: 'grab',
                    p: 0.5,
                    mb: 0.3,
                    borderRadius: 1,
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main'
                    },
                    '&:active': {
                      cursor: 'grabbing'
                    }
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.7rem' },
                      fontWeight: 500,
                      color: 'text.primary',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    • {job.name || `Job ${index + 1}`}
                  </Typography>
                  {job.duration && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: { xs: '0.5rem', sm: '0.55rem' },
                        color: 'text.secondary'
                      }}
                    >
                      {job.duration}h
                    </Typography>
                  )}
                </Box>
              ))}
              {capacity.jobs.length > 3 && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.5rem', sm: '0.6rem' },
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  +{capacity.jobs.length - 3} more...
                </Typography>
              )}
            </Box>
          ) : (
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.55rem', sm: '0.65rem' },
                color: 'text.secondary',
                fontStyle: 'italic',
                textAlign: 'center',
                display: 'block'
              }}
            >
              No jobs scheduled
            </Typography>
          )}
        </Box>

        {/* Bottom Section - Capacity Info */}
        <Box>
          <Chip
            label={`${capacity.scheduledHours.toFixed(1)}h / ${capacity.utilization}%`}
            color={capacityColor}
            size="small"
            sx={{
              fontSize: { xs: '0.6rem', sm: '0.7rem' },
              height: { xs: 18, sm: 20 },
              mb: 0.5,
              width: '100%'
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ fontSize: { xs: '0.55rem', sm: '0.65rem' } }}
          >
            {capacity.totalCapacity}h total
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarDay;