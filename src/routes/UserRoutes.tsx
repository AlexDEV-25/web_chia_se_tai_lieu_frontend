import { Route } from 'react-router-dom';

import Favorites from '../layouts/user/favorites/Favorites';
import MyProfile from '../layouts/user/MyProfile/MyProfile';
import Profile from '../layouts/user/profile/Profile';

export default function UserRoutes() {
    return (
        <>
            <Route
                path="/favorites"
                element={<Favorites />}
            />

            <Route
                path="/myprofile"
                element={<MyProfile />}
            />

            <Route
                path="/profile/:id"
                element={<Profile />}
            />
        </>
    );
}