import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";

const userStore = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem('token_key') ||　""
    },
    //同步修改方法
    reducers: {
        setToken(state, action){
            state.token = action.payload
            //localStorage存一份
            localStorage.setItem('token_key', action.payload)
        }
    }
})

const {setToken} = userStore.actions

const userReducer = userStore.reducer

//获取异步方法 完成登录获取token
const fetchLogin = (loginForm)=>{
    return async (dispatch)=>{
        //发送异步请求
        const res = request.post('/authorizations', loginForm)
        //提交同步action进行token的存入
        dispatch(setToken((await res).data.token))
    }
}

export { fetchLogin, setToken }

export default userReducer