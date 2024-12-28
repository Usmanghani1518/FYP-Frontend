import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name:"",
    role:"",
    email:""
}

const userSlice = createSlice({
    name:"userSlice",
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.name = action.payload.name
            state.email= action.payload.email
            state.role = action.payload.role

        }
    }
})

export const {setUser} = userSlice.actions;
export default userSlice.reducer