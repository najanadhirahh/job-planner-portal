import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import {
  Inventory as PackageIcon,
  Schedule as ClockIcon
} from '@mui/icons-material';

const SummaryCards = ({
  totalOrders,
  scheduledHours,
  capacityUtilization,
  totalCapacity
}) => {
  return (
    <Box display="flex" gap={2} mb={3}>
      <Card sx={{ flex: 1,  backgroundColor:"#a2d2ff"}} >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" component="div">
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scheduledHours.toFixed(1)}h scheduled
              </Typography>
            </Box>
            <PackageIcon color="action" sx={{ fontSize: 40 }} />
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: 1,backgroundColor:"#ffc8dd" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Capacity Utilization
              </Typography>
              <Typography variant="h4" component="div">
                {capacityUtilization}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scheduledHours.toFixed(1)}h / {totalCapacity.toFixed(1)}h
              </Typography>
            </Box>
            <ClockIcon color="action" sx={{ fontSize: 40 }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryCards;