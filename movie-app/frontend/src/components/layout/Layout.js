import React from "react";
import "./layout.css";

export const AppContainer = ({ children, className = "", ...rest }) => (
  <div className={`app-container ${className}`.trim()} {...rest}>
    {children}
  </div>
);

export const PageContainer = ({ children, className = "", ...rest }) => (
  <div className={`page-container ${className}`.trim()} {...rest}>
    {children}
  </div>
);

export const Section = ({ title, subtitle, action, children, className = "", ...rest }) => (
  <section className={`section-block ${className}`.trim()} {...rest}>
    {(title || subtitle || action) && (
      <div className="section-heading">
        <div>
          {title && <h2>{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const ContentGridLayout = ({ children, className = "", ...rest }) => (
  <div className={`content-grid-layout ${className}`.trim()} {...rest}>
    {children}
  </div>
);
