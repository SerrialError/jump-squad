import "../App.css";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import supabase from '../components/Supabase';

function Goals() {
  const [goalName, setGoalName] = useState("");
  const [targetHours, setTargetHours] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
  const [userId, setUserId] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    async function fetchGoals() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Please sign in to create Goals');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUserId(user.id);

        // Fetch all goals for the user
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.error("Error fetching goals:", error);
        } else {
          setGoals(data);
        }
      }
      setLoading(false);
    }
    fetchGoals();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const newGoal = {
      name: goalName,
      target_hours: targetHours,
      due_date: dueDate,
      logged_hours: 0,
      id: userId
    };

    if (new Date(dueDate) < new Date(currentDate)) {
      alert("Due date must be today or a future date.");
      setLoading(false);
      return;
    }

    try {
      if (editingGoalIndex !== null) {
        // Update existing goal
        const goalId = goals[editingGoalIndex].id;
        const { error } = await supabase
          .from('goals')
          .update({
            name: goalName,
            target_hours: targetHours,
            due_date: dueDate
          })
          .eq('id', goalId);

        if (error) {
          console.error('Error updating goal:', error);
          alert('Failed to update goal. Please try again.');
        } else {
          const updatedGoals = [...goals];
          updatedGoals[editingGoalIndex] = { ...newGoal, id: goals[editingGoalIndex].id };
          setGoals(updatedGoals);
          setEditingGoalIndex(null);
          setGoalName('');
          setTargetHours('');
          setDueDate('');
        }
      } else {
        // Insert new goal
        const { data, error } = await supabase.from('goals').insert([{ ...newGoal }]);

        if (error) {
          console.error('Error inserting goal:', error);
          alert('Failed to save goal. Please try again.');
        } else if (data && data.length > 0) {
          setGoals([...goals, { ...newGoal, id: data[0].id }]);
          setGoalName('');
          setTargetHours('');
          setDueDate('');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (index) => {
    const goal = goals[index];
    setGoalName(goal.name);
    setTargetHours(goal.target_hours);
    setDueDate(goal.due_date);
    setEditingGoalIndex(index);
    setAnchorEl(null);
  };

  const handleDeleteGoal = async (index) => {
    const goal = goals[index];
    const { id, name } = goal;
    
    // Perform delete operation
    const { error } = await supabase
      .from('goals')
      .delete()
      .match({ id, name });
  
    if (error) {
      console.error('Error deleting goal:', error);
    } else {
      const updatedGoals = goals.filter((_, i) => i !== index);
      setGoals(updatedGoals);
      setAnchorEl(null);
    }
  };
  

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedGoalIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isGoalOverdue = (goal) => {
    const dueDate = new Date(goal.due_date);
    const today = new Date();
    const isOverdue = goal.logged_hours < goal.target_hours && dueDate <= today;
    const isCompleted = goal.logged_hours >= goal.target_hours;

    return {
      isOverdue,
      isCompleted,
    };
  };

  const getProgressPercentage = (goal) => {
    const { logged_hours, target_hours } = goal;
    const percentage = (logged_hours / target_hours) * 100;
    return `${percentage.toFixed(0)}% Complete`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Goals
        </Typography>
        {!isAuthenticated ? (
          <Typography variant="h2">
            Please sign in to create Goals
          </Typography>
        ) : (
        <><Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="goalName"
                    label="Goal Name"
                    name="goalName"
                    autoFocus
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    color="primary"
                    InputProps={{
                      style: {
                        backgroundColor: "white",
                      },
                    }} />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="targetHours"
                    label="Target Hours"
                    name="targetHours"
                    type="number"
                    value={targetHours}
                    onChange={(e) => setTargetHours(e.target.value)}
                    color="primary"
                    InputProps={{
                      style: {
                        backgroundColor: "white",
                      },
                    }} />
                  <TextField
                    margin="normal"
                    fullWidth
                    id="dueDate"
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    color="primary"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: currentDate,
                    }}
                    sx={{
                      backgroundColor: "white",
                    }} />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingGoalIndex !== null
                        ? "Update Goal"
                        : "Save Goal"}
                  </Button>
                </Box>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Goals
                  </Typography>
                  {goals.length === 0 ? (
                    <Typography variant="body1">No goals currently</Typography>
                  ) : (
                    goals.map((goal, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: (() => {
                            const { isOverdue, isCompleted } = isGoalOverdue(goal);
                            if (isCompleted) {
                              return "rgba(0, 128, 0, 0.2)"; // Green background for completed goals
                            } else if (isOverdue) {
                              return "rgba(255, 0, 0, 0.2)"; // Red background for overdue goals
                            }
                            return "rgba(255, 255, 255, 0.8)"; // Default background
                          })(),
                          padding: 2,
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{goal.name}</Typography>
                          <Typography variant="body2">
                            Target Hours: {goal.target_hours}
                          </Typography>
                          <Typography variant="body2">
                            Logged Hours: {goal.logged_hours}
                          </Typography>
                          <Typography variant="body2">
                            Due Date: {new Date(goal.due_date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            Progress: {getProgressPercentage(goal)}
                          </Typography>
                        </Box>
                        <IconButton
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleMenuOpen(e, index)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Container>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleEditGoal(selectedGoalIndex)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDeleteGoal(selectedGoalIndex)}>Delete</MenuItem>
          </Menu>
        </>
        )}
      </header>
    </div>
  );
}

export default Goals;
