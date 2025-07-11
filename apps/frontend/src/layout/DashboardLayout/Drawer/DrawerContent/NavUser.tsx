import { MouseEvent, useState } from 'react';

// next
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// material-ui
import Box from '@mui/material/Box';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, Theme, useTheme } from '@mui/material/styles';

// project import
import { useGetMenuMaster } from 'api/menu';
import Avatar from 'components/@extended/Avatar';
import useUser from 'hooks/useUser';

// assets
import RightOutlined from '@ant-design/icons/RightOutlined';

interface ExpandMoreProps extends IconButtonProps {
  theme?: Theme;
  expand: boolean;
  drawerOpen: boolean;
}

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen',
})(({ expand, drawerOpen }: ExpandMoreProps) => {
  const theme = useTheme();
  return {
    transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
    marginLeft: 'auto',
    color: theme.palette.secondary.dark,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    ...(!drawerOpen && {
      opacity: 0,
      width: 50,
      height: 50,
    }),
  };
});

// ==============================|| LIST - USER ||============================== //

export default function NavUser() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { user } = useUser();

  const router = useRouter();
  const { data: session } = useSession();
  const provider = session?.provider;

  const handleLogout = () => {
    switch (provider) {
      case 'auth0':
        signOut({
          callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/auth0`,
        });
        break;
      case 'cognito':
        signOut({
          callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/logout/cognito`,
        });
        break;
      default:
        signOut({ redirect: false });
    }

    router.push('/login');
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        p: 1.25,
        px: !drawerOpen ? 1.25 : 3,
        borderTop: '2px solid',
        borderTopColor: 'divider',
      }}
    >
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              expand={open}
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              aria-label="show more"
            >
              <RightOutlined style={{ fontSize: '0.625rem' }} />
            </ExpandMore>
          }
          sx={{
            '& .MuiListItemSecondaryAction-root': {
              right: !drawerOpen ? -20 : -16,
            },
          }}
        >
          <ListItemAvatar>
            {user && (
              <Avatar
                alt="Avatar"
                src={user.profile.profile_img}
                sx={{ ...(drawerOpen && { width: 46, height: 46 }) }}
              />
            )}
          </ListItemAvatar>
          {user && (
            <ListItemText
              primary={user.profile.first_name + ' ' + user.profile.last_name}
              secondary="UI/UX Designer"
            />
          )}
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
}
