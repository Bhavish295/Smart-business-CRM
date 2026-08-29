export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

export const LEAD_STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  won: 'Won',
  lost: 'Lost',
};

export const FOLLOWUP_STATUSES = ['pending', 'completed', 'cancelled'];

export const EMPLOYEE_ROLES = ['admin', 'sales', 'manager', 'support'];

export const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#ef4444'];

export const emptyForm = {
  lead: { name: '', email: '', phone: '', company: '', status: 'new', source: 'website', notes: '' },
  client: { name: '', email: '', phone: '', company: '', status: 'active' },
  followUp: { title: '', notes: '', due_date: '', lead_id: '', status: 'pending' },
  employee: { name: '', email: '', phone: '', role: 'sales', department: '', status: 'active' },
};
