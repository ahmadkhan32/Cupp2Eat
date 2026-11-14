'use client';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './index';
import { setUser } from '@/features/auth/authSlice';
import { createClient } from '@/lib/supabase/client';

function AuthSubscriber({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // 1. Initial session restoration
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || !session?.user) return;
      const user = session.user;
      let role = user.user_metadata?.role || 'customer';

      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()
        .then(({ data: roleData }) => {
          if (!mounted) return;
          if (roleData?.role) role = roleData.role;
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              role,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            })
          );
        })
        .catch(() => {
          if (!mounted) return;
          dispatch(
            setUser({
              id: user.id,
              email: user.email,
              role,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            })
          );
        });
    });

    // 2. Realtime Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const user = session.user;
        let role = user.user_metadata?.role || 'customer';

        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single()
          .then(({ data: roleData }) => {
            if (!mounted) return;
            if (roleData?.role) role = roleData.role;
            dispatch(
              setUser({
                id: user.id,
                email: user.email,
                role,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              })
            );
          })
          .catch(() => {
            if (!mounted) return;
            dispatch(
              setUser({
                id: user.id,
                email: user.email,
                role,
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              })
            );
          });
      } else if (event === 'SIGNED_OUT') {
        dispatch(setUser(null));
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthSubscriber>{children}</AuthSubscriber>
    </Provider>
  );
}
