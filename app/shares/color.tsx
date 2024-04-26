import { colorize } from "../shared/lib/utils";

export default function Color({ delta }: { delta: number }) {
  return <div className={`${colorize(delta)}`}></div>;
}
