import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function PageLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-slate-800">
            {title}
          </h1>
          <p className="text-sm text-slate-500">
            Monitoring pekerjaan & progres
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
