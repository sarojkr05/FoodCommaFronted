import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    isLoggedIn: false,
    role: '',
    data: {},
};

export const createAccount = createAsyncThunk('/auth/createAccount', async (data) => {
    console.log("incoming data to the thunk", data);
    try {
        const response = axiosInstance.post('/users', data);    
        toast.promise(response, {
            success: (resolvedPromise) => {
                return resolvedPromise?.data?.message;
            },
            loading: 'Hold back tight, we are registering your id...',
            error: 'Ohh No!, Something went wrong. Please try again.',
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error) {
        console.log(error);
    }
});

export const login = createAsyncThunk('/auth/login', async (data, { rejectWithValue }) => {
    console.log("incoming data to the thunk", data);
    try {
        const response = await axiosInstance.post('/auth/login', data);    
        console.log('response',response?.data)
        // toast.promise(response, {
        //     loading: "Logging In , Please wait ...",
        //     success: "Loggoed In Successfully",
        //     error: "Failed to Login, tru again later"
        // })

        toast.success("logged in successfully")

        return response.data; // Ensure response is returned properly
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response?.data || { success: false, message: "Login failed" });
    }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
    console.log("incoming data to the thunk");
    try {
        const response = axiosInstance.post('/auth/logout');    
        toast.promise(response, {
            success: (resolvedPromise) => {
                return resolvedPromise?.data?.message;
            },
            loading: 'Logging out...',
            error: 'Ohh No!, Something went wrong. Please try again.',
        });
        const apiResponse = await response;
        return apiResponse;
    } catch(error) {
        console.log(error);
    }
});

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = true;
            state.role = action?.payload?.data?.userRole;
            state.data = action?.payload?.data?.userData;
            
            // localStorage.setItem('token', )
            
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", action?.payload?.data?.userRole);
            localStorage.setItem("data", JSON.stringify(action?.payload?.data?.userData));
        })        
        .addCase(logout.fulfilled, (state) => {
            localStorage.removeItem('token'); // Remove token on logout
            localStorage.setItem('isLoggedIn', "false"); // Store correct string
            localStorage.setItem('role', '');
            localStorage.setItem('data', JSON.stringify({}));
        
            state.isLoggedIn = false;
            state.role = '';
            state.data = {};
        });        
    }
});


export default AuthSlice.reducer;