import { createContext, useReducer } from "react";
import reducer from "./mainReducer";

export const MainContext = createContext({} as any);

const MainContextWrapper = ({ children }: any) => {
    const initialState = JSON.parse(localStorage.getItem('mainState') as string) || {};
    const [state, dispatch] = useReducer<any>(reducer, initialState);

    const mainContextValue = {
        state,
        dispatch
    };

    return(
        <MainContext.Provider value={mainContextValue}>
            { children }
        </MainContext.Provider>
    );
};

export default MainContextWrapper;