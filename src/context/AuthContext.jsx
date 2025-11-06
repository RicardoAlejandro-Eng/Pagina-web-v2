import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const initialState = {
  user: null, // {id, token, role_id, role_type}; 
  loading: true,
  token: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, 
          user: action.payload,
          token: action.payload.token
      };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData) => {
      localStorage.setItem('jwt', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch({ type: 'LOGIN', payload: userData });
    };
    
    const logout = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'LOGOUT' });
        dispatch({ type: 'SET_LOADING', payload: false });
        localStorage.clear();
    };

    useEffect(() => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = localStorage.getItem('jwt');
      const user = localStorage.getItem('user');
      if(user && token){
          const { id, role_id, role_type } = JSON.parse(user);
          dispatch({ type: 'LOGIN', payload: { id, role_id, role_type, token }});
      };
      dispatch({ type: 'SET_LOADING', payload: false });
    }, []);


    console.log('state: ', state);
    
  return (
    <AuthContext.Provider value={{
      user: state?.user ?? null,
      loading: state?.loading ?? null, 
      token: state?.token ?? null,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
