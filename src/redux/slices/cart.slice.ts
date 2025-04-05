
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface Course {
//     _id: string;
//     title: string;
//     price: number;
//     thumbnail: string;
//     teacher: {
//         name: string;
//     };
// }

// interface CartState {
//     items: Course[];
// }

// // Dummy data array
// const dummyCourses: Course[] = [
//     {
//         _id: "67e1aba26ce0cbc0e3397a97",
//         title: "Ab tu muna ki maa chaa gaii",
//         price: 125,
//         thumbnail: "https://res.cloudinary.com/saadnaeem/image/upload/v1742844358/uploads/r6lwyxmuywod78xlv79o.jpg",
//         teacher: {
//             name: "Teacher"
//         }
//     },
//     {
//         _id: "67e1aba26ce0cbc0e3397a98",
//         title: "Advanced React Course",
//         price: 199,
//         thumbnail: "https://example.com/react-course.jpg",
//         teacher: {
//             name: "React Guru"
//         }
//     }
// ];


// const loadInitialCart = (): Course[] => {
//     // Only use dummy data if localStorage is empty and in development
//     if (process.env.NODE_ENV === 'development') {
//         const savedCart = localStorage.getItem('cart');
//         return savedCart ? JSON.parse(savedCart) : dummyCourses;
//     }
//     // In production, only use localStorage
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
// };

// const initialState: CartState = {
//     items: loadInitialCart(),
// };

// const cartSlice = createSlice({
//     name: 'cart',
//     initialState,
//     reducers: {
//         addToCart: (state, action: PayloadAction<Course>) => {
//             const existingItem = state.items.find(item => item._id === action.payload._id);
//             if (!existingItem) {
//                 state.items.push(action.payload);
//                 localStorage.setItem('cart', JSON.stringify(state.items));
//             }
//         },
//         removeFromCart: (state, action: PayloadAction<string>) => {
//             state.items = state.items.filter(item => item._id !== action.payload);
//             localStorage.setItem('cart', JSON.stringify(state.items));
//         },
//         clearCart: (state) => {
//             state.items = [];
//             localStorage.removeItem('cart');
//         },
//         resetToDummyData: (state) => {
//             state.items = dummyCourses;
//             localStorage.setItem('cart', JSON.stringify(dummyCourses));
//         }
//     },
// });

// export const { addToCart, removeFromCart, clearCart, resetToDummyData } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Teacher {
    _id: string;
    name: string;
}

export interface Course {
    _id: string;
    title: string;
    price: number;
    thumbnail: string;
    description?: string;
    category?: string;
    students?: number;
    averageRating?: number;
    teacher: Teacher;
}

interface CartState {
    items: Course[];
}

const initialState: CartState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Course>) => {
            const existingItem = state.items.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
        updateCart: (state, action: PayloadAction<Course[]>) => {
            state.items = action.payload;
        }
    }
});

export const { addToCart, removeFromCart, clearCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;

