import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, getToken, removeToken } from "@/utils";
import { loginAPI, getProfileAPI } from "@/apis/user";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: getToken() || "",
        userInfo: {}
    },
    //同步修改方法
    reducers: {
        setToken(state, action){
            state.token = action.payload
            //localStorage存一份
            _setToken(action.payload)
        },
        setUserInfo(state, action){
            state.userInfo = action.payload
        },
        clearUserInfo(state){
            state.token = ''
            state.userInfo = {}
            removeToken()
        }
    }
})

const { setToken, setUserInfo, clearUserInfo } = userStore.actions

const userReducer = userStore.reducer

//获取异步方法 完成登录获取token
const fetchLogin = (loginForm)=>{
    return async (dispatch)=>{
        //发送异步请求
        const res = await loginAPI(loginForm)
        //提交同步action进行token的存入
        dispatch(setToken(res.data.token))
    }
}

//获取个人用户信息异步方法
const fetchUserInfo = ()=>{
    return async (dispatch)=>{
        const res = await getProfileAPI()
        dispatch(setUserInfo(res.data))
    }
}

export { fetchLogin, fetchUserInfo, clearUserInfo }

export default userReducer