import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Calendars from "../pages/Calendars";

export const publicRoutes = [
    {path:'/login', element: Login},
    // {path:'/hashNames', element: HashNames},
    // {path:'/recent', element: RecentSkins},
    {path:'/registration', element: Registration},
    {path:'/calendars', element: Calendars},
    // {path:'/main', element: ActiveLots},
    // {path:'/posts/:post_id/edit', element: PostEdit},
    // {path:'/categoriesEditor', element: CategoriesEditor},
    // {path:'/createCategory', element: CreateCategory},
    // {path:'/password-recovery', element: PasswordRecovery},
    // {path:'/password-reset/:token', element: PasswordReset},
    // {path:'/error', element: Error},
    // {path:'/users', element: Users}
];