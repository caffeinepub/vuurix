interface PriceProps {
  amount: bigint;
  className?: string;
}

export default function Price({ amount, className = '' }: PriceProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(amount) / 100);

  return <span className={className}>{formatted}</span>;
}

