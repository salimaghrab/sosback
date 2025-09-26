import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Paper,
  Avatar,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  ViewModule,
  Event as EventIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import PropTypes from "prop-types";

// Calendar utilities
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MaintenanceCalendar = ({ maintenances = [], contracts = [], sites = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("month"); // month, week
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  // Get maintenance events with additional info
  const maintenanceEvents = useMemo(() => {
    return maintenances.map((maintenance) => {
      const contract = contracts.find((c) => c.id === maintenance.contractId);
      const site = contract ? sites.find((s) => s.id === contract.siteId) : null;
      const scheduledDate = new Date(maintenance.scheduledDate);
      const completedDate = maintenance.completedDate ? new Date(maintenance.completedDate) : null;
      const isOverdue = !completedDate && scheduledDate < new Date();

      return {
        ...maintenance,
        contract,
        site,
        scheduledDate,
        completedDate,
        isOverdue,
        displayDate: scheduledDate,
      };
    });
  }, [maintenances, contracts, sites]);

  // Filter events based on status
  const filteredEvents = useMemo(() => {
    if (filterStatus === "all") return maintenanceEvents;

    return maintenanceEvents.filter((event) => {
      switch (filterStatus) {
        case "completed":
          return event.status === "Completed";
        case "scheduled":
          return event.status === "Scheduled";
        case "overdue":
          return event.isOverdue;
        case "in-progress":
          return event.status === "InProgress" || event.status === "In Progress";
        default:
          return true;
      }
    });
  }, [maintenanceEvents, filterStatus]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return filteredEvents.filter(
      (event) => event.displayDate.toDateString() === date.toDateString()
    );
  };

  // Generate calendar days for month view
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 42); // 6 weeks

    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const dayEvents = getEventsForDate(date);
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    return days;
  };

  // Generate week days for week view
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayEvents = getEventsForDate(date);

      days.push({
        date,
        isToday: date.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
    }

    return days;
  };

  // Navigation functions
  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction * 7);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Event status color mapping
  const getEventColor = (event) => {
    if (event.isOverdue) return "error";
    switch (event.status?.toLowerCase()) {
      case "completed":
        return "success";
      case "inprogress":
      case "in progress":
        return "warning";
      case "scheduled":
        return "info";
      default:
        return "primary";
    }
  };

  // Event icon mapping
  const getEventIcon = (event) => {
    if (event.isOverdue) return <WarningIcon fontSize="small" />;
    switch (event.status?.toLowerCase()) {
      case "completed":
        return <CheckCircleIcon fontSize="small" />;
      case "inprogress":
      case "in progress":
        return <BuildIcon fontSize="small" />;
      default:
        return <ScheduleIcon fontSize="small" />;
    }
  };

  // Handle event click
  const handleEventClick = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setDetailsDialog(true);
  };

  // Render calendar day
  const renderCalendarDay = (day) => {
    const { date, isCurrentMonth, isToday, events } = day;
    const hasEvents = events.length > 0;

    return (
      <Paper
        key={date.toISOString()}
        sx={{
          minHeight: 120,
          p: 1,
          cursor: hasEvents ? "pointer" : "default",
          border: isToday ? 2 : 1,
          borderColor: isToday ? "primary.main" : "divider",
          bgcolor: !isCurrentMonth ? "grey.50" : "background.paper",
          "&:hover": hasEvents ? { elevation: 2 } : {},
        }}
        onClick={() => hasEvents && setSelectedDate(date)}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="body2"
            color={isCurrentMonth ? "text.primary" : "text.secondary"}
            fontWeight={isToday ? "bold" : "normal"}
          >
            {date.getDate()}
          </Typography>
          {hasEvents && (
            <Badge badgeContent={events.length} color="primary" max={9}>
              <EventIcon fontSize="small" />
            </Badge>
          )}
        </Box>

        <Box sx={{ maxHeight: 80, overflowY: "auto" }}>
          {events.slice(0, 3).map((event, index) => (
            <Chip
              key={`${event.id}-${index}`}
              label={`${event.equipmentModel} - ${event.equipmentSerial}`}
              size="small"
              color={getEventColor(event)}
              variant="outlined"
              sx={{
                mb: 0.5,
                fontSize: "0.7rem",
                height: 20,
                "& .MuiChip-label": { px: 0.5 },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
            />
          ))}
          {events.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              +{events.length - 3} more
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  // Render week day
  const renderWeekDay = (day) => {
    const { date, isToday, events } = day;

    return (
      <Paper key={date.toISOString()} sx={{ minHeight: 400, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" color={isToday ? "primary" : "text.primary"}>
              {DAYS[date.getDay()]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {date.getDate()} {MONTHS[date.getMonth()]}
            </Typography>
          </Box>
          <Badge badgeContent={events.length} color="primary">
            <EventIcon />
          </Badge>
        </Box>

        <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
          {events.map((event, index) => (
            <Card
              key={`${event.id}-${index}`}
              variant="outlined"
              sx={{
                mb: 1,
                cursor: "pointer",
                "&:hover": { elevation: 2 },
              }}
              onClick={() => handleEventClick(event)}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  {getEventIcon(event)}
                  <Typography variant="body2" fontWeight="bold">
                    {event.equipmentModel}
                  </Typography>
                  <Chip
                    label={event.status}
                    size="small"
                    color={getEventColor(event)}
                    variant="outlined"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Serial: {event.equipmentSerial}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Site: {event.site?.siteName || "Unknown"}
                </Typography>
                {event.engineer && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    Engineer: {event.engineer}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
              No maintenance scheduled
            </Typography>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Card>
      <CardContent>
        {/* Calendar Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h5" fontWeight="bold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Typography>
            <Button variant="outlined" size="small" startIcon={<Today />} onClick={goToToday}>
              Today
            </Button>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            {/* View Mode Toggle */}
            <IconButton
              color={viewMode === "month" ? "primary" : "default"}
              onClick={() => setViewMode("month")}
              title="Month View"
            >
              <ViewModule />
            </IconButton>
            <IconButton
              color={viewMode === "week" ? "primary" : "default"}
              onClick={() => setViewMode("week")}
              title="Week View"
            >
              <ViewWeek />
            </IconButton>

            {/* Navigation */}
            <IconButton
              onClick={() => (viewMode === "month" ? navigateMonth(-1) : navigateWeek(-1))}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={() => (viewMode === "month" ? navigateMonth(1) : navigateWeek(1))}>
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar Content */}
        {viewMode === "month" ? (
          <>
            {/* Month Header */}
            <Grid container spacing={1} mb={1}>
              {DAYS.map((day) => (
                <Grid item xs key={day}>
                  <Typography
                    variant="subtitle2"
                    textAlign="center"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* Month Grid */}
            <Grid container spacing={1}>
              {getCalendarDays().map((day, index) => (
                <Grid item xs key={index}>
                  {renderCalendarDay(day)}
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          /* Week View */
          <Grid container spacing={2}>
            {getWeekDays().map((day, index) => (
              <Grid item xs key={index}>
                {renderWeekDay(day)}
              </Grid>
            ))}
          </Grid>
        )}

        {/* Statistics Summary */}
        <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" color="info.main">
                  {filteredEvents.filter((e) => e.status === "Scheduled").length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Scheduled
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" color="warning.main">
                  {
                    filteredEvents.filter(
                      (e) => e.status === "InProgress" || e.status === "In Progress"
                    ).length
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  In Progress
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">
                  {filteredEvents.filter((e) => e.status === "Completed").length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h6" color="error.main">
                  {filteredEvents.filter((e) => e.isOverdue).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overdue
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Maintenance Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            {selectedMaintenance && getEventIcon(selectedMaintenance)}
            <Typography variant="h6">Maintenance Details</Typography>
            <Chip
              label={selectedMaintenance?.status}
              color={selectedMaintenance ? getEventColor(selectedMaintenance) : "default"}
              size="small"
            />
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedMaintenance && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Equipment Information
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedMaintenance.equipmentModel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Serial: {selectedMaintenance.equipmentSerial}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Site Information
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedMaintenance.site?.siteName || "Unknown Site"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Client: {selectedMaintenance.site?.clientName || "Unknown"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Schedule
                </Typography>
                <Typography variant="body2">
                  Scheduled: {selectedMaintenance.scheduledDate.toLocaleDateString()}
                </Typography>
                {selectedMaintenance.completedDate && (
                  <Typography variant="body2" color="success.main">
                    Completed: {selectedMaintenance.completedDate.toLocaleDateString()}
                  </Typography>
                )}
                {selectedMaintenance.period && (
                  <Typography variant="body2" color="info.main">
                    Period: {selectedMaintenance.period}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assignment
                </Typography>
                <Typography variant="body2">
                  Engineer: {selectedMaintenance.engineer || "Unassigned"}
                </Typography>
                <Typography variant="body2">
                  Contract:{" "}
                  {selectedMaintenance.contractNumber ||
                    selectedMaintenance.contract?.contractNumber}
                </Typography>
              </Grid>

              {selectedMaintenance.remarks && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Remarks
                  </Typography>
                  <Typography variant="body2">{selectedMaintenance.remarks}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
          {selectedMaintenance?.status !== "Completed" && (
            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}>
              Mark as Completed
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Card>
  );
};

MaintenanceCalendar.propTypes = {
  maintenances: PropTypes.array,
  contracts: PropTypes.array,
  sites: PropTypes.array,
};

export default MaintenanceCalendar;
