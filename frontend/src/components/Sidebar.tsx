interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tv' },
    { id: 'employees', label: 'Tables', icon: 'fas fa-table' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' },
  ];
  const accountPages = [
      { id: 'profile', label: 'Profile', icon: 'fas fa-user-circle' },
      { id: 'signin', label: 'Sign In', icon: 'fas fa-sign-in-alt' },
      { id: 'signup', label: 'Sign Up', icon: 'fas fa-user-plus' },
  ]

  return (
    <aside className="w-64 bg-surface shadow-soft-lg flex flex-col flex-shrink-0 m-4 rounded-xl">
      <div className="p-4 text-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-heading">Soft UI Dashboard</h1>
      </div>
      <nav className="flex-1 px-4 py-2">
        {menuItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
            className="flex items-center gap-3 rounded-lg px-4 py-3 my-1 text-sm font-semibold transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-soft transition-all duration-300 ${
                activePage === item.id ? 'bg-primary' : 'bg-surface'
            }`}>
              <i className={`${item.icon} ${activePage === item.id ? 'text-white' : 'text-primary'}`}></i>
            </div>
            <span className={activePage === item.id ? 'text-heading' : 'text-secondary'}>{item.label}</span>
          </a>
        ))}
        <h3 className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase">Account Pages</h3>
        {accountPages.map(item => (
            <a key={item.id} href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 my-1 text-sm font-semibold text-secondary transition-colors">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-soft bg-surface">
                    <i className={`${item.icon} text-primary`}></i>
                 </div>
                 <span>{item.label}</span>
            </a>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <div className="p-6 text-center bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl text-white">
            <h4 className="font-semibold">Need help?</h4>
            <p className="text-xs mt-1 mb-3">Please check our docs</p>
            <button className="w-full bg-white text-heading font-bold text-xs py-2 rounded-lg">DOCUMENTATION</button>
        </div>
      </div>
    </aside>
  );
}