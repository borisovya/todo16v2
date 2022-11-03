import {AnyAction, Dispatch} from "redux";
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    setIsInitializedAC,
    SetIsInitializedActionType
} from "../../app/app-reducer";
import {authAPI, LoginParamsType, StatusCode} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";


const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AnyAction): InitialStateType  => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res)=>{
            if (res.data.resultCode === StatusCode.Ok) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch);

            }
        })
        .catch((error: AxiosError)=>{
            handleServerNetworkError(error, dispatch)
        })
}

export const logOutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut()
        .then((res)=>{
            if (res.data.resultCode === StatusCode.Ok) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch);

            }
        })
        .catch((error: AxiosError)=>{
            handleServerNetworkError(error, dispatch)
        })
}



// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType | SetIsInitializedActionType