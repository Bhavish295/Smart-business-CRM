import { useEffect, useState, useMemo } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, UserPlus } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import { emptyForm, LEAD_STATUSES, LEAD_STATUS_LABELS } from '../utils/constants';

const Leads = () => {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(emptyForm.lead);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads');
      if (res.data.success) setLeads(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        !search ||
        l.name?.toLowerCase().includes(search.toLowerCase()) ||
        l.email?.toLowerCase().includes(search.toLowerCase()) ||
        l.company?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [leads, search, statusFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm.lead);
    setModalOpen(true);
  };

  const openEdit = (lead) => {
    setEditingId(lead.id);
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      status: lead.status || 'new',
      source: lead.source || 'website',
      notes: lead.notes || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/leads/${editingId}`, form);
        setLeads((prev) => prev.map((l) => (l.id === editingId ? res.data.data : l)));
        toast.success('Lead updated successfully');
      } else {
        const res = await api.post('/leads', form);
        setLeads((prev) => [res.data.data, ...prev]);
        toast.success('Lead created successfully');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Lead deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const handleConvert = async (id) => {
    try {
      await api.post(`/clients/convert/${id}`);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'won' } : l)));
      toast.success('Lead converted to client');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to convert lead');
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Leads"
        description="Manage and track your sales pipeline"
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={fetchLeads}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Lead
            </button>
          </>
        }
      />

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search leads..." />
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading leads..." />
      ) : filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            title="No leads found"
            description={leads.length === 0 ? 'Create your first lead to get started.' : 'Try adjusting your search or filters.'}
            action={leads.length === 0 && (
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Add Lead
              </button>
            )}
          />
        </div>
      ) : (
        <div className="panel table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id}>
                    <td><strong>{lead.name}</strong></td>
                    <td>
                      <div className="cell-stack">
                        <span>{lead.email || '—'}</span>
                        {lead.phone && <span className="cell-muted">{lead.phone}</span>}
                      </div>
                    </td>
                    <td>{lead.company || '—'}</td>
                    <td><StatusBadge status={lead.status} /></td>
                    <td>{lead.source || '—'}</td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-group">
                        <button type="button" className="btn-icon-sm" onClick={() => openEdit(lead)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        {lead.status !== 'won' && (
                          <button type="button" className="btn-icon-sm success" onClick={() => handleConvert(lead.id)} title="Convert to client">
                            <UserPlus size={14} />
                          </button>
                        )}
                        <button type="button" className="btn-icon-sm danger" onClick={() => handleDelete(lead.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Lead' : 'Add New Lead'}>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input name="company" value={form.company} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Source</label>
              <input name="source" value={form.source} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Leads;
