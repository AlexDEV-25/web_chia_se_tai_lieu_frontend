import { Routes } from 'react-router-dom';
import AuthRoutes from './AuthRoutes';
import CommonRoutes from './CommonRoutes';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';



export default function AppRoutes() {
    return (
        <Routes>
            {AuthRoutes()}
            {CommonRoutes()}
            {UserRoutes()}
            {AdminRoutes()}
        </Routes>
    );
}