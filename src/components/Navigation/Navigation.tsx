import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link href="/">Forsíða</Link></li>
        <li><Link href="/manage">Búa til spurningu</Link></li>
      </ul>
    </nav>
  );
}