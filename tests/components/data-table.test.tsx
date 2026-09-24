import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from '../../client/src/components/dashboard/data-table';

describe('DataTable Component', () => {
  it('renders anomaly rows with severity indicators', () => {
    render(
      <DataTable
        anomalies={[
          {
            id: '1',
            time: '12:00',
            metric: 'Error Rate',
            value: '4.2%',
            expected: '< 0.5%',
            severity: 'critical',
            status: 'active',
          },
        ]}
      />
    );
    expect(screen.getByText('Error Rate')).toBeDefined();
    expect(screen.getByText('4.2%')).toBeDefined();
    expect(screen.getByText('critical')).toBeDefined();
  });
});
