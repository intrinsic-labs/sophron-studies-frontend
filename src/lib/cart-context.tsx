'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  secondaryAddress?: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
}

export interface ShippingOption {
  service: string;
  serviceName: string;
  rate: string;
  currency: string;
  deliveryDays?: string;
  deliveryDate?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  shippingAddress?: ShippingAddress;
  selectedShippingOption?: ShippingOption;
  shippingStep: 'cart' | 'address' | 'shipping' | 'payment';
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_SHIPPING_ADDRESS'; payload: ShippingAddress }
  | { type: 'SET_SHIPPING_OPTION'; payload: ShippingOption }
  | { type: 'SET_SHIPPING_STEP'; payload: 'cart' | 'address' | 'shipping' | 'payment' }
  | { type: 'RESET_SHIPPING' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item._id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        shippingAddress: undefined,
        selectedShippingOption: undefined,
        shippingStep: 'cart',
      };
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_SHIPPING_ADDRESS':
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case 'SET_SHIPPING_OPTION':
      return {
        ...state,
        selectedShippingOption: action.payload,
      };
    case 'SET_SHIPPING_STEP':
      return {
        ...state,
        shippingStep: action.payload,
      };
    case 'RESET_SHIPPING':
      return {
        ...state,
        shippingAddress: undefined,
        selectedShippingOption: undefined,
        shippingStep: 'cart',
      };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingOption: (option: ShippingOption) => void;
  setShippingStep: (step: 'cart' | 'address' | 'shipping' | 'payment') => void;
  resetShipping: () => void;
  getTotalWithShipping: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    shippingStep: 'cart',
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const setShippingAddress = (address: ShippingAddress) => {
    dispatch({ type: 'SET_SHIPPING_ADDRESS', payload: address });
  };

  const setShippingOption = (option: ShippingOption) => {
    dispatch({ type: 'SET_SHIPPING_OPTION', payload: option });
  };

  const setShippingStep = (step: 'cart' | 'address' | 'shipping' | 'payment') => {
    dispatch({ type: 'SET_SHIPPING_STEP', payload: step });
  };

  const resetShipping = () => {
    dispatch({ type: 'RESET_SHIPPING' });
  };

  const getTotalWithShipping = () => {
    const itemsTotal = getTotalPrice();
    const shippingCost = state.selectedShippingOption ? parseFloat(state.selectedShippingOption.rate) : 0;
    return itemsTotal + shippingCost;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    setShippingAddress,
    setShippingOption,
    setShippingStep,
    resetShipping,
    getTotalWithShipping,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 