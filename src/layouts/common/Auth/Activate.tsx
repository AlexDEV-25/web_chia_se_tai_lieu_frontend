import { useEffect, useState, useRef } from "react";
import { activateUser } from "../../../apis/AuthApi";
import { useParams } from "react-router-dom";
const Activate: React.FC = () => {
    const { email } = useParams();
    const { activationCode } = useParams();
    const [activated, setActivated] = useState<boolean>(false);
    const [notification, setNotification] = useState("");
    const isCalled = useRef(false);
    useEffect(() => {
        if (isCalled.current) return;
        isCalled.current = true;
        if (email && activationCode) {
            activate();
        }
    }, [])

    const activate = async () => {
        try {
            const response = await activateUser(email + "", activationCode + "");
            if (response.code == 1000) {
                setActivated(true);
            } else {
                setNotification(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <h1>Kích hoạt tài khoản</h1>
            {
                activated
                    ? (<p> Tài khoản đã kích hoạt thành công, bạn hãy đăng nhập để tiếp tục sử dụng dịch vụ!</p>)
                    : (<p>{notification}</p>)
            }
        </>
    );
}
export default Activate;