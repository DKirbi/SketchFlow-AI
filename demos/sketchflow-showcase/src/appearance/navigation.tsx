/* eslint-disable react-refresh/only-export-components -- navigate helper + redirect component */
import { useCallback } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { appearanceSearchFromParams } from './params';

export function useHubNavigate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  return useCallback(
    (pathname: string) => {
      navigate({ pathname, search: appearanceSearchFromParams(params) });
    },
    [navigate, params],
  );
}

export function AppearanceNavigate({ to }: { to: string }) {
  const [params] = useSearchParams();
  return <Navigate to={{ pathname: to, search: appearanceSearchFromParams(params) }} replace />;
}
