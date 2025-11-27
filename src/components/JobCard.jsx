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
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="flex-start" gap={1} flex={1} minWidth={0}>
            {isHovered && (
              <IconButton size="small" sx={{ p: 0, mt: 0.5 }}>
                <GripIcon fontSize="small" color="action" />
              </IconButton>
            )}
            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle2" noWrap>
                {job.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                ID: {job.id}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={job.priorityLevel}
            color={getPriorityColor(job.priorityLevel)}
            size="small"
            sx={{ flexShrink: 0 }}
          />
        </Box>
        
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <UserIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {job.customer}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <ClockIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {job.requiredHours}h required
            </Typography>
          </Box>
          
          {job.deadline && (
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(job.deadline).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;