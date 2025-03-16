import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//  const [copied, setCopied] = useState(false);

//  useEffect(() => {
//    const timer = setTimeout(() => {
//      setTerminalStep((prev) =>
//        prev < terminalSteps.length - 1 ? prev + 1 : prev
//      );
//    }, 500);
//
//    return () => clearTimeout(timer);
//  }, [terminalStep]);

//  const copyToClipboard = () => {
//    navigator.clipboard.writeText(terminalSteps.join('\n'));
//    setCopied(true);
//    setTimeout(() => setCopied(false), 2000);
//  };
