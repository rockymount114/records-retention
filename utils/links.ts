type NavLink = {
    href: string;
    label: string;
  };
  
  export const links: NavLink[] = [
    { href: '/', label: 'home' },
    { href: '/records ', label: 'all records' },
    { href: '/records/create ', label: 'create record' },
    { href: '/records', label: 'my records' },
    { href: '/profile ', label: 'profile' },
  ];