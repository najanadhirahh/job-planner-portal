import React, { useState } from 'react';
import { getPriorityColor } from '../utils/jobUtils';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import {
  Schedule as ClockIcon,
  Person as UserIcon,
  CalendarToday as CalendarIcon,
  DragIndicator as GripIcon
} from '@mui/icons-material';

const JobCard = ({ job, onDragStart }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDragStart = (e) => {
    onDragStart(e, job);
  };

  const getBorderColor = (priority) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#e0e0e0';
    }
  };

  return (
    <Card 
      sx={{ 
        cursor: 'move',
        transition: 'all 0.2s',
        borderLeft: `4px solid ${getBorderColor(job.priorityLevel)}`,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)'
        }
      }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ p: 2 }}>
  {/* Grid Container */}
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: '1fr auto',
    gap: 1,
    alignItems: 'center'
  }}>
    
    {/* Row 1: Job Name and Priority */}
    <Typography 
      variant="subtitle2" 
      noWrap 
      sx={{ 
        gridColumn: 1,
        lineHeight: 1.2 
      }}
    >
      {job.name}
    </Typography>
    <Chip 
      label={job.priorityLevel}
      color={getPriorityColor(job.priorityLevel)}
      size="small"
      // sx={{ gridColumn: 2, flexShrink: 0 }}
    />

    {/* Row 2: Job ID and Customer */}
    <Box display="flex" alignItems="center" gap={0.5}>
      <GripIcon fontSize="small" color="action" />
      <Typography variant="caption" color="text.secondary" noWrap>
        {job.id}
      </Typography>
    </Box>
    
    <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-start">
      <UserIcon fontSize="small" color="action" />
      <Typography variant="caption" color="text.secondary" noWrap>
        {job.customer}
      </Typography>
    </Box>

    {/* Row 3: Hours and Deadline */}
    <Box display="flex" alignItems="center" gap={0.5}>
      <ClockIcon fontSize="small" color="action" />
      <Typography variant="caption" color="text.secondary">
        {job.requiredHours}h
      </Typography>
    </Box>

    {job.deadline && (
      <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-start">
        <CalendarIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          {new Date(job.deadline).toLocaleDateString()}
        </Typography>
      </Box>
    )}
  </Box>
</CardContent>
    </Card>
  );
};

export default JobCard;