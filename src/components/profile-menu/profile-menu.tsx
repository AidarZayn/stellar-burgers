import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  async function handleLogout() {
    try {
      await dispatch(logoutUser());
      navigate('/');
    } catch (error) {
      console.error('Произошла ошибка при выхода из аккаунта');
    }
  }

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
