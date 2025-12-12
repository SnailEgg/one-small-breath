"use client"
import axios from "axios";
import { useEffect } from "react";
import { connect } from 'react-redux';
import { setUser } from './user-slice';
import { useRouter } from "next/navigation";
import store from "./store";

const Authenticator = ({ setIsAuthenticated, setUser }) => {
    const router = useRouter();
    const userState = store.getState().user?.user;

    useEffect( () => {
        (async () => {
            try {
                const { data } = await axios.get("/api/authenticate");
                if (!data.authenticated) {
                    throw new Error("User not authenticated");
                }

                // if the user has beaten the game, we don't want to authenticate them
                // this is to stop them from continuing to have access to the terminal
                const authenticated = !(data?.account?.is_outside);

                // if the current user is already logged in, don't overwrite their stored data
                // but if this is a new user, we want to erase any data from the previous user
                if (userState?.username !== undefined && data?.account?.username === userState?.username) {
                    setUser({ ...userState, isAuthenticated: authenticated});
                } else {
                    setUser({...data.account, isAuthenticated: authenticated});
                }

                setIsAuthenticated(authenticated);

                // send user to the end screen if they already beat the game
                if (data.account.is_outside) {
                    router.push('/outside');
                }
                    
            } catch (error) {
                setUser(null);
                router.push("/authenticate/login");
            }
        })();
    }, []);
}

export default connect(null, {setUser})(Authenticator);