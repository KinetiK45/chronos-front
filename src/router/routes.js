import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import CalendarInspect from "../pages/CalendarInspect";
import EventCreation from "../pages/EventCreation";
import CalendarSettings from "../pages/CalendarSettings";
import AcceptInvitation from "../pages/AcceptInvitation";

export const publicRoutes = [
    {path:'/login', element: Login},
    // {path:'/hashNames', element: HashNames},
    {path:'/calendars/:calendarId/createEvent', element: EventCreation},
    {path:'/registration', element: Registration},
    {path:'/calendars/:calendarId', element: CalendarInspect},
    {path:'/users/:userId', element: Profile},
    {path: '/calendars/:calendarId/settings', element: CalendarSettings},
    {path: '/accept-invitation/:acceptToken', element: AcceptInvitation}
    // {path:'/posts/:post_id/edit', element: PostEdit},
    // {path:'/categoriesEditor', element: CategoriesEditor},
    // {path:'/createCategory', element: CreateCategory},
    // {path:'/password-recovery', element: PasswordRecovery},
    // {path:'/password-reset/:token', element: PasswordReset},
    // {path:'/error', element: Error},
    // {path:'/users', element: Users}
];