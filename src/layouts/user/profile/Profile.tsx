import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ERROR_MESSAGES } from "../../../constants/messages";
import { handleApiError } from "../../../utils/errorHandler";
import { getInfo } from "../../../apis/UserApi";
import type { DocumentFavoriteResponse } from "../../../models/response/DocumentFavoriteResponse";
// import { getListDocumentByUser, } from "../../../apis/DocumentApi";
import { getListLessonByUser } from "../../../apis/LessonApi";
import type { UserBioResponse } from "../../../models/response/UserBioResponse";
import type { FollowCountResponse } from "../../../models/response/FollowCountResponse";
import { followUser, getFollowCount } from "../../../apis/UserFollowApi";
import { getListDocumentByUser } from "../../../apis/DocumentApi";
import type { LessonFavoriteResponse } from "../../../models/response/LessonFavoriteResponse";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    console.log(userId);

    const [followerCount, setFollowerCount] = useState<FollowCountResponse | null>(null);
    const [user, setUser] = useState<UserBioResponse | null>(null);
    const [infoMessage, setInfoMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"documents" | "lessons">("documents");
    const [documents, setDocuments] = useState<DocumentFavoriteResponse[]>([]);
    const [lessons, setLessons] = useState<LessonFavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInfo = async () => {
        try {
            const response = await getFollowCount(userId);
            setFollowerCount(response.result);

        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    };

    const fetchFollowInfo = async () => {
        try {
            const response = await getInfo(userId);
            setUser(response.result);

        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    };
    const handleFollow = async () => {
        try {
            await followUser(userId);
        } catch (err: any) {
            setInfoMessage(handleApiError(err, ERROR_MESSAGES.PROFILE_LOAD_FAILED))
        }
    };

    useEffect(() => {
        fetchInfo();
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (activeTab === "documents") {
                const response = await getListDocumentByUser(userId);
                setDocuments(response.resultList || []);
            } else {
                const response = await getListLessonByUser(userId);
                setLessons(response.resultList || []);
            }
        } catch (err: any) {
            setError(handleApiError(err, ERROR_MESSAGES.UPLOAD_HISTORY_LOAD_FAILED));
        } finally {
            setLoading(false);
        }
    };
    console.log(user);
    console.log(documents);
    console.log(lessons);
    console.log(followerCount);

    return (
        <div>
            <h1>Profile</h1>
            <button onClick={() => setActiveTab("documents")}>Documents</button>
            <button onClick={() => setActiveTab("lessons")}>Lessons</button>
            <button onClick={() => handleFollow()}></button>
        </div>
    );
}

export default Profile;