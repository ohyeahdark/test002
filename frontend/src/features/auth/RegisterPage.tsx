import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useTranslation } from "react-i18next";
import { register as registerAPI } from "../../features/auth/authAPI";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerAPI(username, password);
      navigate("/login"); 
    } catch (err: any) {
      setError(t("login-logout.registerFail"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 ease-in-out px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700 
                      bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out 
                      opacity-100 animate-fade">
        {/* Back to login */}
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          {t("login-logout.backToLogin") || "Back to login"}
        </Link>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("login-logout.register")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("login-logout.registerMessage")}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5 mt-6" onSubmit={handleRegister}>
          {/* Username */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              {t("login-logout.username")}<span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="username"
              placeholder={t("login-logout.usernamePlaceholder")}
              className="placeholder-gray-400 dark:placeholder-gray-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={true}
            />
          </div>

          {/* Password */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300">
              {t("login-logout.password")}<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("login-logout.passwordPlaceholder")}
                className="placeholder-gray-400 dark:placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={true}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 fill-current text-gray-500 dark:text-gray-400" />
                ) : (
                  <EyeCloseIcon className="w-5 h-5 fill-current text-gray-500 dark:text-gray-400" />
                )}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div>
            <Button
              type="submit"
              size="sm"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? t("common.loading") || "Loading..."
                : t("login-logout.register")}
            </Button>
          </div>
        </form>

        {/* Redirect to Sign In */}
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          {t("login-logout.haveAccount") || "Already have an account?"}{" "}
          <Link
            to="/login"
            className="text-brand-500 hover:text-brand-600 dark:text-brand-400 underline"
          >
            {t("login-logout.logIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
