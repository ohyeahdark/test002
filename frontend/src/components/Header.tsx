interface HeaderProps {
    theme: string;
    setTheme: (theme: string) => void;
}

export function Header({ theme, setTheme }: HeaderProps) {
    const toggleTheme = () => {
        const newTheme = theme === 'soft-ui' ? 'corporate-blue' : 'soft-ui';
        setTheme(newTheme);
    };

    return (
        <header className="py-4 px-6 flex justify-between items-center">
            <div>
                <p className="text-sm text-secondary">Pages / Dashboard</p>
                <h3 className="text-lg font-bold text-heading">Dashboard</h3>
            </div>
            <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-full shadow-soft">
                <button onClick={toggleTheme} title="Switch Theme" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <i className="fas fa-palette text-secondary"></i>
                </button>
                <div className="flex items-center gap-2 cursor-pointer">
                    <i className="fas fa-user-circle text-secondary"></i>
                    <span className="text-sm font-semibold text-secondary">Sign In</span>
                </div>
                <i className="fas fa-cog text-secondary cursor-pointer"></i>
                <i className="fas fa-bell text-secondary cursor-pointer"></i>
            </div>
        </header>
    );
}