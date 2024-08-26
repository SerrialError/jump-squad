import * as React from "react";
import * as ReactRouter from "react-router-dom";
import { useAuth } from '../components/AuthContext';
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
  const [avatarEl, setAvatarEl] = React.useState(null);
  const navigate = ReactRouter.useNavigate();
  const { user, setUser } = useAuth();

  React.useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const { data: tableData, error: tableError } = await supabase
            .from('profiles')
            .select()
            .eq('id', user.id);

          if (tableError) throw tableError;

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
      }
    };

    fetchUser();
  }, [user]);

  const handleAvatarClick = (e) => {
    setAvatarEl(e.currentTarget);
  };

  const handleAccountClick = () => {
    user ? navigate("/Account") : navigate("/Login");
  };
  
  const handleDashboardClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/Profile");
  };

  const handleAvatarClose = () => {
    setAvatarEl(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
    navigate("/");
    handleAvatarClose();
  };

  const avatarPopoverOpen = Boolean(avatarEl);

  return (
    <div>
      <Button variant="light" aria-label="account options" onClick={handleAvatarClick}>
        {userData ? (
          <Avatar alt={user?.user_metadata?.full_name || 'User'} src={userData} />
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
          {user && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handleProfileClick}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountClick}>
              {user ? (
                <ListItemText primary="Account Settings" />
              ) : (
                <ListItemText primary="Sign In" />
              )}
            </ListItemButton>
          </ListItem>
          {user && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton onClick={handleSignOut}>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Popover>
    </div>
  );
};

export default AvatarFunc;
