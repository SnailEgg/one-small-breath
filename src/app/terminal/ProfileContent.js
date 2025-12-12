"use client"
import Button from "@/app/Button";
import store from "@/redux/store";
import { setUser } from "@/redux/user-slice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { connect } from "react-redux";

const ProfileContent = ({ setUser }) => {
    const userState = store.getState();
    const user = userState.user.user;
    const router = useRouter();
    if (!user) return '';

    const logout = async () => {
        try {
            await axios.post("/api/logout");
            setUser(null);
            router.push("/authenticate/login");
        } catch (error) {
            console.log(error);
        }
    }

    const purge = async () => {
        await axios.delete("/api/purge/");
        setUser({ ...store.getState().user.user, storedMessages: []});
        router.push('purge');
    }

    return (
        <section className='flex flex-col h-full overflow-y-auto scrollbar-terminal'>
            <h2 className="text-3xl mb-4">{user?.name}</h2>
            <div className="pb-4">
                <p><span className="font-bold">ID:</span> <span className="italic">{user?.user_id}</span></p>
                <p><span className="font-bold">Alias:</span> <span className="italic">{user?.username}</span></p>
            </div>
            <div className="pb-4">
                <p><span className="font-bold">Vitals:</span> <span className="italic">Disturbed</span></p>
            </div>
            <div className="grow flex flex-col justify-end">
                <Button onClick={purge} text="Purge conversation" className="w-full mt-6 p-2 glow-box glow-text"></Button>
                <Button onClick={logout} text="Log out" className="w-full mt-6 p-2 glow-box glow-text"></Button>
            </div>
        </section>
    );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
}

export default connect(mapStateToProps, { setUser })(ProfileContent);