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

const CalendarDay = ({ date, isPastDate, capacity, onDrop, onDragOver, onClick, handleJobDragStart }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  
  // FIX: Use local date components instead of ISO string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const isToday = new Date().toDateString() === date.toDateString();

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!isPastDate) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleLocalDrop = (e) => {
    e.preventDefault();
    if (!isPastDate) {
      setIsDragOver(false);
      onDrop(e, dateString);
    }
  };

  const handleLocalDragOver = (e) => {
    e.preventDefault();
    if (!isPastDate) {
      onDragOver(e);
    }
  };

  const handleClick = () => {
    if (!isPastDate && onClick) {
      onClick(dateString);
    }
  };

  return (
    <Card
      sx={{
        height: { xs: 100, sm: 120, md: 140 },
        width: { xs: '100%' },
        maxWidth: '100%',
        cursor: isPastDate ? 'not-allowed' : 'pointer',
        boxShadow: isDragOver ? 6 : 1,
        transition: 'all 0.2s',
        border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: isDragOver ? 'primary.light' : (isPastDate ? 'action.disabledBackground' : 'background.paper'),
        opacity: isPastDate ? 0.6 : 1,
        '&:hover': !isPastDate ? {
          boxShadow: 2,
          transform: 'scale(1.02)'
        } : {},
      }}
      onDrop={handleLocalDrop}
      onDragOver={handleLocalDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
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
          <Box display="flex" flexDirection="row" alignItems="flex-end" gap={0.5}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                color: isPastDate ? 'text.disabled' : 'text.primary'
              }}
            >
              {dayNumber}
            </Typography>
            <Typography 
              variant="caption" 
              display="block" 
              sx={{
                pb: 0.5, 
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                color: isPastDate ? 'text.disabled' : 'text.secondary'
              }}
            >
              {monthName}
            </Typography>
          </Box>
          {!isPastDate && capacity.jobs.length > 0 && (
            <IconButton size="small" sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: '0.8rem', sm: '1rem' } } }}>
              <EditIcon fontSize="small" color="action" />
            </IconButton>
          )}
        </Box>

        {/* Middle Section - Job Names */}
        <Box sx={{ 
          flex: 1, 
          minHeight: 0, 
          overflow: 'hidden', 
          my: 0.5,
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}>
          {capacity.jobs.length > 0 ? (
            <Box sx={{ maxHeight: '100%', overflow: 'auto' }}>
              {capacity.jobs.slice(0, 3).map((job, index) => (
                <Box
                  key={job.id || index}
                  draggable={!isPastDate}
                  onDragStart={(e) => !isPastDate && handleJobDragStart(e, job, dateString)}
                  // onDragEnd={handleJobDragEnd}
                  sx={{
                    cursor: !isPastDate ? 'grab' : 'not-allowed',
                    p: 0.5,
                    mb: 0.3,
                    borderRadius: 1,
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    opacity: isPastDate ? 0.6 : 1,
                    '&:hover': !isPastDate ? {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main'
                    } : {},
                    '&:active': !isPastDate ? {
                      cursor: 'grabbing'
                    } : {}
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.7rem' },
                      fontWeight: 500,
                      color: isPastDate ? 'text.disabled' : 'text.primary',
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
                        color: isPastDate ? 'text.disabled' : 'text.secondary'
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
                    color: isPastDate ? 'text.disabled' : 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  +{capacity.jobs.length - 3} more...
                </Typography>
              )}
            </Box>
          ) : isPastDate ? (
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '0.55rem', sm: '0.65rem' },
                color: 'text.disabled',
                fontStyle: 'italic',
                textAlign: 'center',
                display: 'block'
              }}
            >
              Past date
            </Typography>
          ) : null}
        </Box>

        {/* Bottom Section - Capacity Info */}
        <Box 
          display={'flex'} 
          justifyContent={'space-between'}
          borderRadius={1}
          sx={{
            backgroundColor: isPastDate ? 'action.disabled' : (
              capacity.utilization <= 10 ? '#f0f0f0ff' :
              capacity.utilization <= 60 ? '#c6f8b6ff' :
              capacity.utilization <= 85 ? '#f5d09aff' :
              '#f8a19bff'
            ),
            p: 0.5
          }}
        >
          <Typography
            variant="caption"
            display="block"
            sx={{ 
              fontSize: { xs: '0.55rem', sm: '0.65rem' },
              color: isPastDate ? 'text.disabled' : 'text.primary'
            }}
          >
            {capacity.scheduledHours}h /{capacity.totalCapacity}h total
          </Typography>
          <Typography
            variant="caption"
            display="block"
            sx={{ 
              fontSize: { xs: '0.55rem', sm: '0.65rem' },
              color: isPastDate ? 'text.disabled' : 'text.secondary'
            }}
          >
            {capacity.utilization}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CalendarDay;