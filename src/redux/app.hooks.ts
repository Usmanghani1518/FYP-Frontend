
// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './app';


// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// export const useCart = () => {
//     const dispatch = useAppDispatch();
//     const cart = useAppSelector((state) => state.cart);

//     return {
//         ...cart,
//         addToCart: (course: Course) => dispatch(addToCart(course)),
//         removeFromCart: (id: string) => dispatch(removeFromCart(id)),
//         clearCart: () => dispatch(clearCart()),
//         totalItems: cart.items.length,
//         totalPrice: cart.items.reduce((sum, item) => sum + item.price, 0),
//         isInCart: (id: string) => cart.items.some(item => item._id === id),
//     };
// };

// app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './app'; // Make sure this path is correct
import {
    addToCart,
    removeFromCart,
    clearCart,
    updateCart
} from './slices/cart.slice'; // Import the actions
import { Course } from './slices/cart.slice'; // Import the Course type

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCart = () => {
    const dispatch = useAppDispatch();
    const cart = useAppSelector((state) => state.cart);

    return {
        ...cart,
        addToCart: (course: Course) => dispatch(addToCart(course)),
        removeFromCart: (id: string) => dispatch(removeFromCart(id)),
        clearCart: () => dispatch(clearCart()),
        updateCart: (courses: Course[]) => dispatch(updateCart(courses)),
        totalItems: cart.items.length,
        totalPrice: cart.items.reduce((sum, item) => sum + item.price, 0),
        isInCart: (id: string) => cart.items.some(item => item._id === id)
    };
};