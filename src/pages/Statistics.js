import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, axisClasses } from '@mui/x-charts';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HourSubmission from '../components/HourSubmission';
import supabase from '../components/Supabase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import '../App.css';

function createData(month, hours) {
  return { month, hours: hours ?? 0 };
}

const initialData = [
  createData('January', 0),
  createData('February', 0),
  createData('March', 0),
  createData('April', 0),
  createData('May', 0),
  createData('June', 0),
  createData('July', 0),
  createData('August', 0),
  createData('September', 0),
  createData('October', 0),
  createData('November', 0),
  createData('December', 0),
];

const LeaderboardAndStatistics = () => {
  const theme = useTheme();
  const [fetchError, setFetchError] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [data, setData] = useState(initialData);
  const [id, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form_url, setFormUrl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Please sign in to view Statistics');
        setLoading(false);
        return;
      }

      setUserId(user.id);
      setName(user.user_metadata.name);

      const { data: tableData, error: tableError } = await supabase
        .from('Statistics')
        .select()
        .eq('id', user.id);

      if (tableError) {
        console.log(tableError);
        return;
      }

      if (tableData && tableData.length > 0) {
        const record = tableData[0];
        setData([
          { month: 'January', hours: Number(record.January) || 0 },
          { month: 'February', hours: Number(record.February) || 0 },
          { month: 'March', hours: Number(record.March) || 0 },
          { month: 'April', hours: Number(record.April) || 0 },
          { month: 'May', hours: Number(record.May) || 0 },
          { month: 'June', hours: Number(record.June) || 0 },
          { month: 'July', hours: Number(record.July) || 0 },
          { month: 'August', hours: Number(record.August) || 0 },
          { month: 'September', hours: Number(record.September) || 0 },
          { month: 'October', hours: Number(record.October) || 0 },
          { month: 'November', hours: Number(record.November) || 0 },
          { month: 'December', hours: Number(record.December) || 0 },
        ]);
      }

      const { data: formData, error: formError } = await supabase
        .from('Statistics')
        .select('form_url')
        .eq('id', user.id)
        .single();

      if (formError) {
        console.warn(formError);
      } else if (formData) {
        setFormUrl(formData.form_url);
      }

      setLoading(false);
    }

    async function fetchStatistics() {
      const { data, error } = await supabase
        .from('Statistics')
        .select();

      if (error) {
        setFetchError("Could not fetch statistics");
        setStatistics([]);
        console.log(error);
      } else if (data) {
        const statsWithTotalHours = data.map(stat => {
          const monthlyHours = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const totalHours = monthlyHours.reduce((acc, month) => acc + (Number(stat[month]) || 0), 0);
          return {
            ...stat,
            totalHours
          };
        });

        const sortedStatistics = statsWithTotalHours.sort((a, b) => b.totalHours - a.totalHours);

        setStatistics(sortedStatistics.slice(0, 10)); // Limit to 10 values
        setFetchError(null);
      }
    }

    fetchUserData();
    fetchStatistics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const record = {
      January: data.find(month => month.month === 'January').hours,
      February: data.find(month => month.month === 'February').hours,
      March: data.find(month => month.month === 'March').hours,
      April: data.find(month => month.month === 'April').hours,
      May: data.find(month => month.month === 'May').hours,
      June: data.find(month => month.month === 'June').hours,
      July: data.find(month => month.month === 'July').hours,
      August: data.find(month => month.month === 'August').hours,
      September: data.find(month => month.month === 'September').hours,
      October: data.find(month => month.month === 'October').hours,
      November: data.find(month => month.month === 'November').hours,
      December: data.find(month => month.month === 'December').hours,
      id,
      Name: name,
    };

    const { data: tableData, error: tableError } = await supabase
      .from('Statistics')
      .select()
      .eq('id', id);

    if (tableError) {
      console.log(tableError);
      return;
    }

    if (!tableData || tableData.length === 0) {
      const { error } = await supabase
        .from('Statistics')
        .insert([record]);

      if (error) {
        console.log(error);
        return;
      }
      console.log("Inserting data");
    } else {
      const { error } = await supabase
        .from('Statistics')
        .update(record)
        .eq('id', id);

      if (error) {
        console.log(error);
        return;
      }
      console.log("Updating data");
    }

    setData([
      { month: 'January', hours: Number(record.January) || 0 },
      { month: 'February', hours: Number(record.February) || 0 },
      { month: 'March', hours: Number(record.March) || 0 },
      { month: 'April', hours: Number(record.April) || 0 },
      { month: 'May', hours: Number(record.May) || 0 },
      { month: 'June', hours: Number(record.June) || 0 },
      { month: 'July', hours: Number(record.July) || 0 },
      { month: 'August', hours: Number(record.August) || 0 },
      { month: 'September', hours: Number(record.September) || 0 },
      { month: 'October', hours: Number(record.October) || 0 },
      { month: 'November', hours: Number(record.November) || 0 },
      { month: 'December', hours: Number(record.December) || 0 },
    ]);
  };

  async function updateForm(event, formUrl) {
    event.preventDefault();

    setLoading(true);

    const updates = {
      id,
      form_url: formUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('Statistics').upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setFormUrl(formUrl);
    }

    setLoading(false);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (month, value) => {
    const newData = data.map((d) =>
      d.month === month ? { ...d, hours: Number(value) } : d
    );
    setData(newData);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Statistics
        </Typography>
        <div
          style={{ display: "flex", height: "40vh", justifyContent: "center" }}
        >
          <div style={{ width: "80%", height: "100%" }}>
            {error ? (
              <h1>{error}</h1>
            ) : (
              <>
                <Button
                  variant="contained"
                  aria-controls="input-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  sx={{ mb: 2 }}
                >
                  Input Hours (Temporary)
                </Button>
                <Menu
                  id="input-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {data.map((month) => (
                    <MenuItem key={month.month}>
                      <label>
                        {month.month}:
                        <input
                          type="number"
                          value={month.hours}
                          onChange={(e) =>
                            handleInputChange(month.month, e.target.value)
                          }
                        />l
                      </label>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </MenuItem>
                </Menu>
                <BarChart
                  dataset={data}
                  axisHighlight={{
                    x: 'band',
                    y: 'none',
                  }}
                  margin={{
                    top: 16,
                    right: 20,
                    left: 70,
                    bottom: 30,
                  }}
                  xAxis={[
                    {
                      scaleType: "band",
                      dataKey: "month",
                      tickNumber: 5,
                      tickLabelStyle: theme.typography.body2,
                    },
                  ]}
                  yAxis={[
                    {
                      label: "Hours",
                      labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                      },
                      tickLabelStyle: theme.typography.body2,
                      tickNumber: 5,
                      minValue: 0, // Add this line to set the minimum value to 0
                    },
                  ]}
                  series={[
                    {
                      dataKey: "hours",
                      showMark: false,
                      color: theme.palette.primary.light,
                    },
                  ]}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    [`.${axisClasses.root} line`]: {
                      stroke: theme.palette.text.secondary,
                    },
                    [`.${axisClasses.root} text`]: {
                      fill: theme.palette.text.secondary,
                    },
                    [`& .${axisClasses.left} .${axisClasses.label}`]: {
                      transform: "translateX(-25px)",
                    },
                  }}
                />
              </>
            )}
          </div>
          <div>
            <Typography component="h1" variant="h4" gutterBottom>
              Leaderboard
            </Typography>
            {fetchError && <p>{fetchError}</p>}
            {statistics.length > 0 && (
              <ol>
                {statistics.slice(0, 10).map((stat) => ( // Limit to 10 values
                  <li key={stat.id}>
                    <p>
                      {stat.Name}: {stat.totalHours} hours
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ mt: 10, mb: 2, width: '50%' }}>
            <Typography component="h1" variant="h3" gutterBottom>
              Submit hours
            </Typography>
            <p>
              Submitting hours lets you see your hours in the graph above and in the leaderboard, to help you track your total time volunteering. They also add to your profile to help showcase the work you have completed.
            </p>
            <p>
              You can submit hours by uploading a JPG, PNG, PDF, or DOC/DOCX file. It must include proof that you have completed your hours with a signature and an email to contact the volunteer organizer.
            </p>
            <Box
              component="form"
              onSubmit={(e) => updateForm(e, form_url)}
              noValidate
              sx={{ mt: 1 }}
            >
              <HourSubmission
                url={form_url}
                size={150}
                onUpload={(event, url) => {
                  updateForm(event, url);
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Loading..." : "Confirm Submission"}
              </Button>
            </Box>
          </Box>
        </div>
      </header>
    </div>
  );
};

export default LeaderboardAndStatistics;