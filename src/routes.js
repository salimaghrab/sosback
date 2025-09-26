// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Users from "layouts/users";
import AddProject from "layouts/project/data/AddProject";
// @mui icons
import Icon from "@mui/material/Icon";
import Equipment from "layouts/Equipements";
import Missions from "layouts/Mission";
import MissionPlanning from "layouts/Mission/data/MissionPlanning";
import UtilisateurTable from "layouts/users/Data/UtilisateurTable";
import EmployeeTable from "layouts/users/Data/EmployeeTable";
import AddEmployee from "layouts/users/Data/AddEmployee";
import AddAccount from "layouts/users/Data/AddAccount";
import AddEngineer from "layouts/users/Data/AddEngineer";
import AddBrand from "layouts/Equipements/data/AddBrand";
import MaintenanceCalendar from "layouts/Maintenance/MaintenanceCalendar";
import MaintenanceDashboard from "layouts/Maintenance";
import AddEquipmentModel from "layouts/Equipements/data/AddEquipmentModel";
import AddEquipment from "layouts/Equipements/data/AddEquipment";
import ContractAddForm from "layouts/Maintenance/data/ContractAddForm";
import EditEquipment from "layouts/Equipements/data/EditEquipment";
import EditEquipmentModel from "layouts/Equipements/data/EditEquipmentModel";
import AutoLogout from "layouts/authentication/log-out";
import ProtectedRoute from "ProtectedRoute";
const routes = [
  {
    type: "redirect",
    name: "Home",
    key: "home",
    route: "/",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute requiredRoles={["Admin", "Engineer"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  /*  {
    type: "collapse",
    name: "Projects",
    key: "Projects",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/projects",
    component: <Projects />,
  },
  */
  {
    type: "route",
    name: "Add Project",
    key: "add-project",
    route: "/projects/add",
    component: <AddProject />,
  },
  {
    type: "collapse",
    name: "PPM",
    key: "Maintenance",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/maintenance",
    component: <MaintenanceDashboard />,
  },
  {
    type: "collapse",
    name: "Fire System",
    key: "equipment",
    icon: <Icon fontSize="small">construction</Icon>,
    route: "/equipment",
    component: <Equipment />,
  },
  {
    type: "route",
    name: "Brands",
    key: "add brand",
    route: "/brands/add",
    component: <AddBrand />,
  },
  {
    type: "route",
    name: "Add Equipment Model",
    key: "equipment",
    route: "/equipment-models/add",
    component: <AddEquipmentModel />,
  },
  {
    type: "route",
    name: "Add contract",
    key: "contract",
    route: "/contracts/add",
    component: <ContractAddForm />,
  },
  {
    type: "route",
    name: "Add Equipment ",
    key: "equipment",
    route: "/equipments/add",
    component: <AddEquipment />,
  },
  {
    type: "route",
    name: "Edit Equipment ",
    key: "equipment",
    route: "/equipment/edit/:id",
    component: <EditEquipment />,
  },
  {
    type: "route",
    name: "Edit Equipment ",
    key: "equipment",
    route: "equipment-models/edit/:id",
    component: <EditEquipmentModel />,
  },
  {
    type: "route",
    name: "maintenance",
    key: "maintenance",
    route: "/maintenance/schedule",
    component: <MaintenanceCalendar />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/users",
    component: <Users />,
  },
  {
    type: "route",
    name: "add engineer ",
    key: "add-engineer ",
    route: "/add-engineer",
    component: <AddEngineer />,
  },
  // Add direct route for technicians
  {
    type: "route", // This won't show in sidebar but allows direct navigation
    name: "Technicians",
    key: "utilisateurs",
    route: "/users/all",
    component: <UtilisateurTable />,
  },
  {
    type: "route", // This won't show in sidebar but allows direct navigation
    name: "employee",
    key: "employee",
    route: "/users/employee",
    component: <EmployeeTable />,
  },
  {
    type: "route", // This won't show in sidebar but allows direct navigation
    name: "add employee",
    key: "add-employee",
    route: "/add-employee",
    component: <AddEmployee />,
  },
  {
    type: "route", // This won't show in sidebar but allows direct navigation
    name: "add account",
    key: "add-account",
    route: "/add-account",
    component: <AddAccount />,
  },
  {
    type: "collapse",
    name: "Emergency Call",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Planning ",
    key: "plan",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/missions",
    component: <Missions />,
  },
  {
    type: "route", // This won't show in sidebar but allows direct navigation
    name: "planning ",
    key: "planning",
    route: "/missions/plan",
    component: <MissionPlanning />,
  },
  /*   {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  }, */
  {
    type: "route",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <AutoLogout />,
  },
];

export default routes;
