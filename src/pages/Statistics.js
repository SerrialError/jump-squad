import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, axisClasses } from '@mui/x-charts';
import { Grid, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HourSubmission from '../components/HourSubmission';
import supabase from '../components/Supabase';
import Typography from '@mui/material/Typography';
import { axiosInstance } from '../components/axios';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [form_url, setFormUrl] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUserId(user.id);

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
        } else {
          setData([]);
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

        setStatistics(sortedStatistics.slice(0, 10));
        setFetchError(null);
      }
    }

    fetchUserData();
    fetchStatistics();
  }, [responseData]);  

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
      const response = await axiosInstance.post('api/v1/sendemail', { uuid: id });
      setResponseData(response.data.data);
      if (error) {
        console.error('Error fetching data:', error);
      }
      else {
	    console.log(responseData);
      }	 
      setFormUrl(formUrl);
    }

    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Typography component="h1" variant="h3" gutterBottom>
          Statistics
        </Typography>
        <Paper
          style={{ 
            display: "flex", 
            height: "60vh", 
            width: "80%", 
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "rgb(255, 255, 255, 0.1)",
            borderRadius: "15px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
            {!isAuthenticated ? (
              <Typography variant="h2" color="white">Please sign in to create Goals</Typography>
            ) : (
              <>
              {fetchError ? ( 
		            <h1>{fetchError}</h1>
	            ) : (
                data.length > 0 ? (
                <BarChart
                  dataset={data}
                  axisHighlight={{
                    x: "band",
                    y: "none",
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
                      minValue: 0,
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
                    backgroundColor: "white",
                    borderRadius: "20px",
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
                  tooltip={{
                    trigger: 'item',
                    formatter: (params) => `${params.value} hours`
                  }}
                />
              ) : (
                <Typography variant="h2" align="center" color="white">No Hours Uploaded</Typography>
              )
            )}
            </>
          )}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography component="h2" variant="h4" color="white" gutterBottom>
              Leaderboard
            </Typography>
            {statistics.length > 0 && (
              <ol style={{ color: 'white', fontSize: "1.5rem" }}>
                {statistics.slice(0, 10).map((stat) => (
                  <li key={stat.id}>
                    <Typography component="h2" variant="h5" color="white">
                      {stat.Name}: {stat.totalHours} hours
                    </Typography>
                  </li>
                ))}
              </ol>
            )}
          </Grid>
        </Grid>
      </Paper>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {!error && (
            <>
              <Box sx={{ mt: 10, mb: 2, width: "50%" }}>
                <Typography component="h1" variant="h3" gutterBottom>
                  Submit hours
                </Typography>
                <p>
                  Submitting hours lets you see your hours in the graph above
                  and in the leaderboard, to help you track your total time
                  volunteering. They also add to your profile to help showcase
                  the work you have completed.
                </p>
                <p>
                  You can submit hours by uploading a JPG, PNG, PDF, or DOC/DOCX
                  file. It must include proof that you have completed your hours
                  with a signature and an email to contact the volunteer
                  organizer.
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
                    onUploadSuccess={(success) => setFileUploaded(success)}
                  />
                  {fileUploaded && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Confirm Submission"}
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </div>
      </header>
    </div>
  );
};

export default LeaderboardAndStatistics;
