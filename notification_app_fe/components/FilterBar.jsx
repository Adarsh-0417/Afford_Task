import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './FilterBar.css';

export default function FilterBar({ 
  limit, 
  setLimit, 
  notificationType, 
  setNotificationType,
  page,
  setPage,
  onRefresh
}) {
  return (
    <Box className="filter-bar">
      <Box className="filter-container">
        <TextField
          label="Limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 10))}
          variant="outlined"
          size="small"
          inputProps={{ min: 1, max: 100 }}
          sx={{ width: '120px' }}
        />

        <FormControl sx={{ width: '160px' }} size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            label="Type"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">💼 Placement</MenuItem>
            <MenuItem value="Result">📊 Result</MenuItem>
            <MenuItem value="Event">📅 Event</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Page"
          type="number"
          value={page}
          onChange={(e) => setPage(Math.max(1, parseInt(e.target.value) || 1))}
          variant="outlined"
          size="small"
          inputProps={{ min: 1 }}
          sx={{ width: '120px' }}
        />

        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={onRefresh}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' }
          }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
}
