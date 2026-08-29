import { useEffect, useState, useMemo } from 'react';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import { emptyForm } from '../utils/constants';

const Clients = () => {
  const toast = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm.client);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/clients');
      if (res.data.success) setClients(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = useMemo(
    () =>
      clients.filter(
        (c) =>
          !search ||
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.company?.toLowerCase().includes(search.toLowerCase())
      ),
    [clients, search]
  );

  const openCreate = () => { setEditingId(null); setForm(emptyForm.client); setModalOpen(true); };

  const openEdit = (client) => {
    setEditingId(client.id);
    setForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      status: client.status || 'active',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/clients/${editingId}`, form);
        setClients((prev) => prev.map((c) => (c.id === editingId ? res.data.data : c)));
        toast.success('Client updated');
      } else {
        const res = await api.post('/clients', form);
        setClients((prev) => [res.data.data, ...prev]);
        toast.success('Client created');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success('Client deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete client');
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Clients"
        description="Manage your client relationships"
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={fetchClients}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Client
            </button>
          </>
        }
      />

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search clients..." />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading clients..." />
      ) : filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            title="No clients yet"
            description="Add clients manually or convert won leads."
            action={
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Add Client
              </button>
            }
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
                  <th>Since</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td><strong>{client.name}</strong></td>
                    <td>
                      <div className="cell-stack">
                        <span>{client.email || '—'}</span>
                        {client.phone && <span className="cell-muted">{client.phone}</span>}
                      </div>
                    </td>
                    <td>{client.company || '—'}</td>
                    <td><StatusBadge status={client.status} /></td>
                    <td>{new Date(client.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-group">
                        <button type="button" className="btn-icon-sm" onClick={() => openEdit(client)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button type="button" className="btn-icon-sm danger" onClick={() => handleDelete(client.id)} title="Delete">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Client' : 'Add Client'}>
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
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
