// components/Navbar.tsx
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { name: "Home", path: "/" },
  { name: "ICPC Mode", path: "/icpc" },
  { name: "IOI Mode", path: "/ioi" },
  { name: "Help", path: "/help" }, // change to /faq if needed later
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between p-4 shadow-md bg-white dark:bg-gray-900">
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">
        Bingo CP
      </div>
      <ul className="flex gap-6 text-lg">
        {navItems.map(({ name, path }) => {
          const isActive = router.pathname === path;
          return (
            <li key={path}>
              <Link
                href={path}
                className={`transition-colors hover:text-blue-500 dark:hover:text-blue-400 ${
                  isActive
                    ? "font-semibold text-blue-600 dark:text-blue-300 border-b-2 border-blue-500 pb-1"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
