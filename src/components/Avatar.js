import * as React from "react";
import * as ReactRouter from "react-router-dom";
import supabase from '../components/Supabase';
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AvatarFunc = () => {
  const [userData, setUserData] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [session, setSession] = React.useState(null);
  const navigate = ReactRouter.useNavigate(); // Use navigate to programmatically navigate

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not found');
        }
        setUserId(user.id);

        const { data: tableData, error: tableError } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id);

        if (tableError) {
          throw tableError;
        }

        if (Array.isArray(tableData) && tableData.length > 0 && tableData[0].avatar_url) {
          const { data: avatarData } = await supabase.storage.from('avatars').download(tableData[0].avatar_url);
          const url = URL.createObjectURL(avatarData);
          setUserData(url);
        } else {
          setUserData(user.user_metadata?.avatar_url);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [userId]);

  const [avatarEl, setAvatarEl] = React.useState(null);

  const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarEl(e.currentTarget);
  };

  const handleAccountClick = () => {
    !session ? navigate("/Login") : navigate("/Account")
  };
  
  const handleDashboardClick = () => {
    navigate("/")
  };

  const handleAvatarClose = () => {
    setAvatarEl(null);
  };


  const avatarPopoverOpen = Boolean(avatarEl);

  return (
    <div>
        <Button variant="light" onClick={handleAvatarClick}>
          {userData ? (
            <Avatar alt={userData.user_metadata?.full_name || 'User'} src={userData || ''} />
          ) : (
            <AccountCircleIcon />
          )}
        </Button>

      <Popover
        open={avatarPopoverOpen}
        anchorEl={avatarEl}
        onClose={handleAvatarClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDashboardClick}>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountClick}>
              {userData ? (
                <ListItemText primary="Account Page" />
              ) : (
                <ListItemText primary="Sign In" />
              )}
            </ListItemButton>
          </ListItem>
          {userData && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => supabase.auth.signOut()}>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Popover>

    </div>
  );
};

export default AvatarFunc;
