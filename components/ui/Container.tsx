import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10 xl:max-w-[1280px]", className)}>
      {children}
    </div>
  );
}
