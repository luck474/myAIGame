import SnakeGame from '../components/SnakeGame';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center flex-grow">
        <SnakeGame />
      </main>
    </div>
  );
}
