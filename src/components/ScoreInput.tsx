import NumericKeyboard from './NumericKeyboard';

interface ScoreInputProps {
  onScore: (value: number, isDouble: boolean) => void;
}

export default function ScoreInput({ onScore }: ScoreInputProps) {
  return <NumericKeyboard onScore={onScore} />;
}
