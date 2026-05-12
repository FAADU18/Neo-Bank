export const featureItems = [
  {
    title: 'Smart Portfolio View',
    description: 'Track balances, savings goals, loans, and performance in one cinematic dashboard.',
    icon: '◈',
  },
  {
    title: 'Real-Time Protection',
    description: 'Monitor suspicious behavior with risk scoring and live fraud alerts.',
    icon: '⟠',
  },
  {
    title: 'Instant Transfers',
    description: 'Move money between people and accounts with a single polished flow.',
    icon: '⇄',
  },
];

export const testimonials = [
  {
    name: 'Ananya Patel',
    role: 'Product Designer',
    quote: 'NeoBankX feels like a premium fintech terminal, not a generic banking app.',
  },
  {
    name: 'Marcus Reed',
    role: 'Startup Founder',
    quote: 'The futuristic visuals and fast navigation make the product demo stand out immediately.',
  },
  {
    name: 'Sara Kim',
    role: 'Engineering Intern',
    quote: 'Clean architecture, reusable components, and impressive charts in one project.',
  },
];

export const initialTransactions = [
  { id: 1, name: 'Electricity Bill', type: 'debit', amount: 120, status: 'Completed', date: 'Today', category: 'Bills' },
  { id: 2, name: 'Salary Credit', type: 'credit', amount: 4200, status: 'Completed', date: 'Today', category: 'Income' },
  { id: 3, name: 'Amazon Pay', type: 'debit', amount: 89, status: 'Pending', date: 'Yesterday', category: 'Shopping' },
  { id: 4, name: 'Freelance Payout', type: 'credit', amount: 650, status: 'Completed', date: '2d ago', category: 'Income' },
  { id: 5, name: 'Grocery Run', type: 'debit', amount: 164, status: 'Failed', date: '3d ago', category: 'Food' },
  { id: 6, name: 'Savings Transfer', type: 'debit', amount: 500, status: 'Completed', date: '3d ago', category: 'Savings' },
];

export const notificationsSeed = [
  { id: 1, title: 'Salary received', message: 'Your monthly salary landed in NeoBankX Premium.', level: 'success', time: '2m ago' },
  { id: 2, title: 'Unusual login detected', message: 'A device in a new location tried to access your account.', level: 'warning', time: '12m ago' },
  { id: 3, title: 'Savings target updated', message: 'Your AI planner adjusted your goal completion forecast.', level: 'info', time: '1h ago' },
];

export const dashboardStats = {
  totalBalance: 24890.45,
  monthlyIncome: 7850,
  monthlyExpenses: 3120,
  savingsProgress: 72,
  creditScore: 812,
};

export const loanCards = [
  { id: 1, name: 'Home Boost', amount: 250000, rate: '8.4%', tenure: '5 years', status: 'Active' },
  { id: 2, name: 'Education Flex', amount: 120000, rate: '7.1%', tenure: '4 years', status: 'Processing' },
  { id: 3, name: 'Travel Ready', amount: 45000, rate: '10.2%', tenure: '18 months', status: 'Eligible' },
];

export const fraudAlerts = [
  { id: 1, title: 'Multiple OTP attempts', detail: 'Three failed OTP requests from an unfamiliar IP range.', risk: 78, status: 'High' },
  { id: 2, title: 'Large transfer pattern', detail: 'A transfer above your weekly average was initiated.', risk: 61, status: 'Medium' },
  { id: 3, title: 'Device fingerprint changed', detail: 'Login fingerprint differs from your trusted device.', risk: 84, status: 'Critical' },
];

export const adminUsers = [
  { id: 1, name: 'Ava Johnson', email: 'ava@neobankx.com', role: 'Customer', status: 'Active', balance: '$18,420' },
  { id: 2, name: 'Noah Smith', email: 'noah@neobankx.com', role: 'Customer', status: 'Frozen', balance: '$4,220' },
  { id: 3, name: 'Admin Ops', email: 'ops@neobankx.com', role: 'Admin', status: 'Verified', balance: '$0' },
];

export const monthlyCashflow = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  income: [6200, 6900, 7100, 7850, 8300, 8600],
  expenses: [2800, 3100, 2950, 3120, 3280, 3010],
  savings: [1400, 1650, 1760, 1890, 2230, 2410],
};

export const transactionCategoryData = {
  labels: ['Bills', 'Shopping', 'Food', 'Travel', 'Savings', 'Income'],
  values: [21, 16, 14, 11, 18, 20],
};
