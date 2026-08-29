import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="search-input">
    <Search size={16} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default SearchInput;
