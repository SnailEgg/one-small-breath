"use client"
import store from "@/redux/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import ProfileContent from "./ProfileContent";

const Profile = ({ canHide = true }) => {
    const page = usePathname().replace(/\/.*\//, '');

    return (
        <Provider store={store}>
        {
            canHide
            ? <div className={`hidden ${page !== 'user' ? 'lg:block' : ''} w-1/3 max-w-[30rem] shrink-0 mt-12 border-2 border-[--terminal-primary] p-[2.5vh] glow-box`}>
                <ProfileContent />
              </div>
            : <ProfileContent />
        }
        </Provider>
        
    );
}

export default Profile;