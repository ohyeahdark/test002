import ThemeToggleButton from './ThemeToggleButton';
import LanguageSelector from './LanguageSelector';

const SettingControls = () => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <ThemeToggleButton />
      <LanguageSelector />
    </div>
  );
};

export default SettingControls;
