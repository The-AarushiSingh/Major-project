function EmptyState({ title, message, action, onAction }) {
  return <div className="empty-state-panel"><span className="empty-icon">//</span><h3>{title}</h3><p>{message}</p>{action && <button className="button button-ghost button-small" onClick={onAction}>{action} <span aria-hidden="true">-&gt;</span></button>}</div>;
}

export default EmptyState;
