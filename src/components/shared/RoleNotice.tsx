import { ReactNode } from "react";

interface RoleNoticeProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function RoleNotice({ icon, title, description }: RoleNoticeProps) {
  return (
    <div className="card p-8 md:p-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
