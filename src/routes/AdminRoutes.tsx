import { Route } from 'react-router-dom';

import Dashboard from '../layouts/admin/dashboard/Dashboard';

import CategoryList from '../layouts/admin/categories/CategoryList';
import CategoryAdd from '../layouts/admin/categories/CategoryAdd';
import CategoryEdit from '../layouts/admin/categories/CategotyEdit';

import DocumentList from '../layouts/admin/contents/documents/DocumentList';
import DocumentEdit from '../layouts/admin/contents/documents/DocumentEdit';

import LessonList from '../layouts/admin/contents/lessons/LessonList';
import LessonEdit from '../layouts/admin/contents/lessons/LessonEdit';

import UserList from '../layouts/admin/users/UserList';
import UserAdd from '../layouts/admin/users/UserAdd';

import CommentList from '../layouts/admin/interactions/comments/CommentList';
import RatingList from '../layouts/admin/interactions/ratings/RatingList';

import ReportList from '../layouts/admin/interactions/reports/ReportList';
import ReportDetail from '../layouts/admin/interactions/reports/ReportDetail';

export default function AdminRoutes() {
    return (
        <>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/categories" element={<CategoryList />} />

            <Route
                path="/categories/add"
                element={<CategoryAdd />}
            />

            <Route
                path="/categories/edit/:id"
                element={<CategoryEdit />}
            />

            <Route
                path="/documents"
                element={<DocumentList />}
            />

            <Route
                path="/documents/edit/:id"
                element={<DocumentEdit />}
            />

            <Route
                path="/lessons"
                element={<LessonList />}
            />

            <Route
                path="/lessons/edit/:id"
                element={<LessonEdit />}
            />

            <Route path="/users" element={<UserList />} />

            <Route path="/users/add" element={<UserAdd />} />

            <Route
                path="/comments"
                element={<CommentList />}
            />

            <Route
                path="/ratings"
                element={<RatingList />}
            />

            <Route
                path="/reports"
                element={<ReportList />}
            />

            <Route
                path="/reports/:type/:id"
                element={<ReportDetail />}
            />
        </>
    );
}