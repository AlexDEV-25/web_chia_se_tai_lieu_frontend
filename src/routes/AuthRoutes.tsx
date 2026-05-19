import { Route } from 'react-router-dom';

import Register from '../layouts/common/auth/Register';

import ForgotPassword from '../layouts/common/auth/ForgotPassword';
import ChangePassword from '../layouts/common/auth/ChangePassword';
import Activate from '../layouts/common/auth/Activate';
import Login from '../layouts/common/auth/Login';

export default function AuthRoutes() {
    return (
        <>
            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/change-password/:email/:forgotPasswordCode"
                element={<ChangePassword />}
            />

            <Route
                path="/activate/:email/:activationCode"
                element={<Activate />}
            />
        </>
    );
}