import { Route } from 'react-router-dom';

import Home from '../layouts/common/home/Home';
import Lesson from '../layouts/common/lesson/Lesson';

import UploadDocument from '../layouts/common/uploads/UploadDocument';
import UploadLesson from '../layouts/common/uploads/UploadLesson';

import DocumentDetail from '../layouts/common/document_detail/DocumentDetail';
import LessonDetail from '../layouts/common/lesson_detail/LessonDetail';

export default function CommonRoutes() {
    return (
        <>
            <Route path="/" element={<Home />} />

            <Route path="/lesson" element={<Lesson />} />

            <Route
                path="/uploadDocument"
                element={<UploadDocument />}
            />

            <Route
                path="/uploadLesson"
                element={<UploadLesson />}
            />

            <Route
                path="/document/:id"
                element={<DocumentDetail />}
            />

            <Route
                path="/lesson/:id"
                element={<LessonDetail />}
            />
        </>
    );
}