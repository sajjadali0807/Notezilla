import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LayersIcon from "@mui/icons-material/Layers";
import WorkIcon from "@mui/icons-material/Work";
import { Outlet, useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [expand, setExpand] = React.useState({
    ManageCustomers: false,
    ManageProviders: false,
    ManageCategory: false,
    ManageTransaction: false,
    ManageHelpSupport: false,
  });

  const pageNavigation = (path, comp) => {
    navigate(path);
  };

  const expandClick = ({ route, name }) => {
    setExpand((prevState) => ({ ...prevState, [name]: !prevState[name] }));
  };

  //     onclick: expandClick, name: "ManageCustomers", icon: <LayersIcon style={{ color: "wheat" }} />, expand: expand.ManageCustomers,
  //     subheader: [
  //       {
  //         onclickNav: pageNavigation,
  //         name: "View Customer",
  //         startIcon: "",
  //         path: "/viewcustomer",
  //       },
  //     ],
  //   },
  //   { name: "Manage Providers", icon: <WorkIcon style={{ color: "wheat" }} />, path: '/dashboard' },
  //   { name: "Manage Category", icon: <LayersIcon style={{ color: "wheat" }} />, path: '/dashboard' },
  //   { name: "Manage Promo", icon: <LayersIcon style={{ color: "wheat" }} />, path: '/dashboard' },
  //   { name: "Manage Jobs", icon: <HomeOutlinedIcon style={{ color: "wheat" }} />, path: '/dashboard' },
  //   { name: "Manage Transaction", icon: <LayersIcon style={{ color: "wheat" }} />, path: '/dashboard' },
  // ];

  const sidebardata = [
    {
      name: "Dashboard",
      icon: <HomeOutlinedIcon style={{ color: "#637381" }} />,
      path: "/dashboard",
    },
    {
      name: "ManageCustomers",
      icon: <SupervisorAccountOutlinedIcon style={{ color: "#637381" }} />,
      path: "/viewcustomer",
      expand: expand.ManageCustomers,
      subheader: [
        {
          onclickNav: pageNavigation,
          name: "View Customer",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewcustomer",
        },
      ],
    },
    {
      name: "ManageProviders",
      icon: <WorkIcon style={{ color: "#637381" }} />,
      path: "/approvedproviders",
      expand: expand.ManageProviders,
      subheader: [
        {
          onclickNav: pageNavigation,
          name: "Approved Providers",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/approvedproviders",
        },
        {
          onclickNav: pageNavigation,
          name: "Rejected Providers",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/rejectedproviders",
        },
        {
          onclickNav: pageNavigation,
          name: "Requested Providers",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/requestedproviders",
        },
        {
          onclickNav: pageNavigation,
          name: "Providers on Map",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewcustomer",
        },
      ],
    },
    {
      name: "ManageCategory",
      icon: <LayersIcon style={{ color: "#637381" }} />,
      path: "/viewcategory",
      expand: expand.ManageCategory,
      subheader: [
        {
          onclickNav: pageNavigation,
          name: "View Category",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewcategory",
        },
        {
          onclickNav: pageNavigation,
          name: "View SubCategory",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewsubcategory",
        },
        {
          onclickNav: pageNavigation,
          name: "View List of Services",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewservices",
        },
      ],
    },
    {
      name: "Manage Promo",
      icon: <LayersIcon style={{ color: "#637381" }} />,
      path: "/viewpromo",
    },
    {
      name: "Manage Jobs",
      icon: <HomeOutlinedIcon style={{ color: "#637381" }} />,
      path: "/viewjobs",
    },
    {
      name: "ManageTransaction",
      icon: <LayersIcon style={{ color: "#637381" }} />,
      path: "/usertransaction",
      expand: expand.ManageTransaction,
      subheader: [
        {
          onclickNav: pageNavigation,
          name: "User",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/usertransaction",
        },
        {
          onclickNav: pageNavigation,
          name: "Provider",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/providertransaction",
        },
      ],
    },
    {
      name: "Manage Ratings & Reviews",
      icon: <LayersIcon style={{ color: "#637381" }} />,
      path: "/viewratings",
    },
    {
      name: "Manage Help & Support",
      icon: <LayersIcon style={{ color: "#637381" }} />,
      path: "/support",
      expand: expand.ManageHelpSupport,
      subheader: [
        {
          onclickNav: pageNavigation,
          name: "support",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/support",
        },
        {
          onclickNav: pageNavigation,
          name: "About Us & T&C",
          icon: (
            <FiberManualRecordIcon
              style={{ color: "white", fontSize: "10px" }}
            />
          ),
          path: "/viewsubcategory",
        },
      ],
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ backgroundColor: "#1d2b34" }}
          open={open}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Persistent drawer
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#1d2b34",
              color: "white",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon style={{ color: "white" }} />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List sx={{ backgroundColor: "#1d2b34" }}>
            {sidebardata?.map((menu, i) => {
              return (
                <React.Fragment key={i}>
                  {menu.expand !== undefined ? (
                    <ListItemButton onClick={() => expandClick(menu)}>
                      <ListItemIcon className="icon-pad">
                        {menu.icon}
                      </ListItemIcon>
                      <ListItemText primary={menu.name} />
                      {menu.expand === true ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  ) : (
                    <ListItemButton
                      onClick={() => pageNavigation(menu.path, menu.comp)}
                    >
                      <ListItemIcon className="icon-pad">
                        {menu.icon}
                      </ListItemIcon>
                      <ListItemText primary={menu.name} />
                    </ListItemButton>
                  )}
                  {menu.subheader && (
                    <Collapse
                      in={menu.expand}
                      timeout="auto"
                      unmountOnExit
                      className="collapse-list"
                    >
                      {menu.subheader.map((e, index) => {
                        return (
                          <React.Fragment key={index}>
                            <List component="div" disablePadding>
                              <ListItemButton
                                sx={{ pl: 2.5 }}
                                onClick={() => e.onclickNav(e.path, e.comp)}
                              >
                                <ListItemIcon>{e.icon}</ListItemIcon>
                                <ListItemText
                                  className="API-list-item"
                                  primary={e.name}
                                />
                              </ListItemButton>
                            </List>
                          </React.Fragment>
                        );
                      })}
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
          <Divider />
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Outlet />
        </Main>
      </Box>
    </>
  );
}
