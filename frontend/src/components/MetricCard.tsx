import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient?: boolean;
}

export default function MetricCard({ icon: Icon, label, value, gradient }: MetricCardProps) {
  return (
    <div className="card">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${gradient ? 'bg-gradient-primary' : 'bg-gray-800'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-100 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}



