import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Checkbox from "../../components/form/input/Checkbox";
import Button from "../../components/ui/button/Button";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div onSubmit={submit} className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{t('login-logout.logIn')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('login-logout.logInMessage')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          <button className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <img src="/images/brand/brand-05.svg" alt="Google" />
              <path fill="#4285F4" d="..." />
              <path fill="#34A853" d="..." />
              <path fill="#FBBC05" d="..." />
              <path fill="#EB4335" d="..." />
            </svg>
            Google
          </button>

          <button className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-md px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 21 20">
              {/* X icon path */}
              <path d="..." />
            </svg>
            X
          </button>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
          </div>
        </div>

        <form className="space-y-5">
          <div>
            <Label>{t('login-logout.username')} <span className="text-red-500">*</span></Label>
            <Input onChange={e => setUsername(e.target.value)} placeholder={t('login-logout.usernamePlaceholder')} type="username" />
          </div>

          <div>
            <Label>{t('login-logout.password')} <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                onChange={e => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder={t('login-logout.passwordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeCloseIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span>{t('login-logout.keepLogin')}</span>
            </label>
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              {t('login-logout.forgetPassword')}
            </Link>
          </div>

          <Button className="w-full" size="sm" type="submit">
            {t('login-logout.logIn')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('login-logout.noAccount')}{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            {t('login-logout.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
