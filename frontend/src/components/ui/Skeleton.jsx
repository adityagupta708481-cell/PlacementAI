import React from 'react';

/**
 * High-end shimmering Skeleton placeholder component.
 * Used across Dashboard, Coding Profiles, AI Analysis, and CS Fundamentals
 * to eliminate layout shifting (CLS) and ensure butter-smooth page loads.
 */
export default function Skeleton({ className = '', style = {}, ...props }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <Skeleton style={{ width: '100px', height: '14px' }} />
        <Skeleton style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
      </div>
      <Skeleton style={{ width: '70px', height: '32px', marginBottom: '8px' }} />
      <Skeleton style={{ width: '130px', height: '12px' }} />
    </div>
  );
}

export function PlatformCardSkeleton() {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skeleton style={{ width: '42px', height: '42px', borderRadius: '12px' }} />
          <div>
            <Skeleton style={{ width: '90px', height: '16px', marginBottom: '6px' }} />
            <Skeleton style={{ width: '60px', height: '12px' }} />
          </div>
        </div>
        <Skeleton style={{ width: '70px', height: '20px', borderRadius: '12px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '16px 0' }}>
        <Skeleton style={{ height: '56px', borderRadius: '8px' }} />
        <Skeleton style={{ height: '56px', borderRadius: '8px' }} />
        <Skeleton style={{ height: '56px', borderRadius: '8px' }} />
      </div>
      <Skeleton style={{ width: '100%', height: '14px', marginTop: '12px' }} />
    </div>
  );
}
