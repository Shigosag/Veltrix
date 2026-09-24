import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '../../client/src/components/dashboard/kpi-card';

describe('KpiCard Component', () => {
  it('renders label and formatted value accurately', () => {
    render(
      <KpiCard
        label="Monthly Revenue"
        value="$312,480"
        change={18.4}
        trend={[10, 20, 30]}
        color="#f43f5e"
      />
    );
    expect(screen.getByText('Monthly Revenue')).toBeDefined();
    expect(screen.getByText('$312,480')).toBeDefined();
    expect(screen.getByText('+18.4%')).toBeDefined();
  });
});
