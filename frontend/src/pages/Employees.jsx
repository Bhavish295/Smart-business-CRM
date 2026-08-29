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
import { emptyForm, EMPLOYEE_ROLES } from '../utils/constants';

const Employees = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm.employee);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees');
      if (res.data.success) setEmployees(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = useMemo(
    () =>
      employees.filter(
        (e) =>
          !search ||
          e.name?.toLowerCase().includes(search.toLowerCase()) ||
          e.email?.toLowerCase().includes(search.toLowerCase()) ||
          e.department?.toLowerCase().includes(search.toLowerCase())
      ),
    [employees, search]
  );

  const openCreate = () => { setEditingId(null); setForm(emptyForm.employee); setModalOpen(true); };

  const openEdit = (emp) => {
    setEditingId(emp.id);
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      role: emp.role || 'sales',
      department: emp.department || '',
      status: emp.status || 'active',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/employees/${editingId}`, form);
        setEmployees((prev) => prev.map((em) => (em.id === editingId ? res.data.data : em)));
        toast.success('Employee updated');
      } else {
        const res = await api.post('/employees', form);
        setEmployees((prev) => [res.data.data, ...prev]);
        toast.success('Employee added');
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success('Employee removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Employees"
        description="Manage your team members"
        actions={
          <>
            <button type="button" className="btn btn-secondary" onClick={fetchEmployees}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Add Employee
            </button>
          </>
        }
      />

      <div className="toolbar">
        <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." />
      </div>

      {loading ? (
        <LoadingSpinner message="Loading employees..." />
      ) : filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            title="No employees yet"
            description="Add team members to manage your sales force."
            action={
              <button type="button" className="btn btn-primary" onClick={openCreate}>
                <Plus size={16} /> Add Employee
              </button>
            }
          />
        </div>
      ) : (
        <div className="employee-grid">
          {filtered.map((emp) => (
            <div key={emp.id} className="employee-card">
              <div className="employee-avatar">{emp.name?.charAt(0).toUpperCase()}</div>
              <div className="employee-info">
                <h4>{emp.name}</h4>
                <p className="employee-role">{emp.role} {emp.department && `· ${emp.department}`}</p>
                <p className="employee-contact">{emp.email || emp.phone || '—'}</p>
                <StatusBadge status={emp.status} />
              </div>
              <div className="action-group">
                <button type="button" className="btn-icon-sm" onClick={() => openEdit(emp)} title="Edit">
                  <Pencil size={14} />
                </button>
                <button type="button" className="btn-icon-sm danger" onClick={() => handleDelete(emp.id)} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Employee' : 'Add Employee'}>
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
              <label>Department</label>
              <input name="department" value={form.department} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                {EMPLOYEE_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
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

export default Employees;
