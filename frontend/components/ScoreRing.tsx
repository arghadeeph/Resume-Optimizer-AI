type Props = {
  score: number;
};

export default function ScoreRing({ score }: Props) {
  const degrees = Math.round((score / 100) * 360);
  return (
    <div
      className="relative flex h-40 w-40 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#0ea5e9 ${degrees}deg, #e2e8f0 0deg)`
      }}
      aria-label="overall-score-ring"
    >
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white">
        <span className="text-3xl font-bold">{score}</span>
      </div>
    </div>
  );
}
