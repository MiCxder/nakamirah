export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-20">
      <div className="container mx-auto px-6 py-10 text-center text-zinc-400">
        <p>© {new Date().getFullYear()} Nakamirah. All rights reserved.</p>
      </div>
    </footer>
  );
}