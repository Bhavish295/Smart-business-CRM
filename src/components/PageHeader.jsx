const PageHeader = ({ title, description, actions }) => (
  <div className="page-header">
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>
);

export default PageHeader;
