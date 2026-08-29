import { useEffect, useState } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, CheckCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { emptyForm, FOLLOWUP_STATUSES } from '../utils/constants';

const FollowUps = () => {
  const toast = useToast();
  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm.followUp);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fuRes, leadsRes] = await Promise.all([api.get('/follow-ups'), api.get('/leads')]);
      if (fuRes.data.success) setFollowUps(fuRes.data.data);
      if (leadsRes.data.success) setLeads(leadsRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm.followUp); setModalOpen(true); };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      notes: item.notes || '',
      due_date: item.due_date || '',
      lead_id: item.lead_id || '',
      status: item.status || 'pending',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, lead_id: form.lead_id || null };
    try {
      if (editingId) {
        const res = await api.put(`/follow-ups/${editingId}`, payload);
        setFollowUps((prev) => prev.map((f) => (f.id === editingId ? res.data.data : f)));
        toast.success('Follow-up updated');
      } else {
        const res = await api.post('/follow-ups', payload);
        setFollowUps((prev) => [res.data.data, ...prev]);
        toast.success('Follow-up scheduled');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const markComplete = async (id) => {
    try {
      const res = await api.put(`/follow-ups/${id}`, { status: 'completed' });
      setFollowUps((prev) => prev.map((f) => (f.id === id ? res.data.data : f)));
      toast.success('Marked as completed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this follow-up?')) return;
    try {
      await api.delete(`/follow-ups/${id}`);
      setFollowUps((prev) => prev.filter((f) => f.id !== id));
      toast.success('Follow-up deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const isOverdue = (dueDate, status) =>
    status === 'pending' && dueDate && new Date(dueDate) < new Date();

  return (
    <div className="page">
      <PageHeader
        title="Follow-ups"
        description="Schedule and track client follow-ups"
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={fetchData}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Schedule Follow-up
            </button>
          </>
        }
      />

      {loading ? (
        <LoadingSpinner message="Loading follow-ups..." />
      ) : followUps.length === 0 ? (
        <div className="panel">
          <EmptyState
            title="No follow-ups scheduled"
            description="Create follow-ups to stay on top of your leads."
            action={
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Schedule Follow-up
              </button>
            }
          />
        </div>
      ) : (
        <div className="followup-grid">
          {followUps.map((item) => (
            <div key={item.id} className={`followup-card ${isOverdue(item.due_date, item.status) ? 'overdue' : ''}`}>
              <div className="followup-card-header">
                <h4>{item.title}</h4>
                <StatusBadge status={item.status} />
              </div>
              {item.leads && (
                <p className="followup-lead">Lead: {item.leads.name}</p>
              )}
              {item.notes && <p className="followup-notes">{item.notes}</p>}
              <p className="followup-date">
                Due: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'No date set'}
              </p>
              <div className="action-group">
                {item.status === 'pending' && (
                  <button type="button" className="btn btn-sm btn-success" onClick={() => markComplete(item.id)}>
                    <CheckCircle size={14} /> Complete
                  </button>
                )}
                <button type="button" className="btn-icon-sm" onClick={() => openEdit(item)} title="Edit">
                  <Pencil size={14} />
                </button>
                <button type="button" className="btn-icon-sm danger" onClick={() => handleDelete(item.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Follow-up' : 'Schedule Follow-up'}>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {FOLLOWUP_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Related Lead</label>
            <select name="lead_id" value={form.lead_id} onChange={handleChange}>
              <option value="">None</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FollowUps;
