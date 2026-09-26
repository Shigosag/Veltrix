import { PrismaClient, Role, MetricType, DatasetStatus, Severity, AnomalyStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Veltrix database seed...');

  // Safe table purge
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.datasetColumn.deleteMany();
  await prisma.dataset.deleteMany();
  await prisma.widget.deleteMany();
  await prisma.dashboard.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create default admin user
  const passwordHash = await bcrypt.hash('veltrix2026', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@veltrix.ai',
      name: 'Segun Arulogun Gabriel',
      passwordHash,
      role: Role.ADMIN,
      profile: {
        create: {
          company: 'Acme Corporation',
          title: 'Head of Analytics',
          location: 'San Francisco, CA',
          bio: 'Data architect specializing in modern high-throughput streaming analytics, telemetry pipelines, and predictive modeling.',
        },
      },
      preferences: {
        create: {
          theme: 'dark',
          compactDensity: false,
          reducedMotion: false,
          monoFont: 'JetBrains Mono',
          emailAlerts: true,
          insightDigest: true,
          weeklyReport: true,
        },
      },
    },
  });

  console.log(`👤 Seeded User: ${user.email} (Password: veltrix2026)`);

  // Primary Telemetry Metrics
  await prisma.metric.createMany({
    data: [
      {
        name: 'monthly_revenue',
        label: 'Monthly Revenue',
        category: 'Revenue',
        type: MetricType.CURRENCY,
        currentVal: 312480,
        previousVal: 263830,
        targetVal: 275000,
        unit: '$',
        trendData: [82, 91, 88, 97, 104, 112, 121, 128, 137, 146, 158, 168],
      },
      {
        name: 'active_users_dau',
        label: 'Active Users (DAU)',
        category: 'Users',
        type: MetricType.COUNT,
        currentVal: 18124,
        previousVal: 16905,
        targetVal: 17500,
        unit: '',
        trendData: [68, 72, 69, 75, 81, 84, 88, 91, 87, 94, 98, 102],
      },
      {
        name: 'avg_session_duration',
        label: 'Avg Session Duration',
        category: 'Performance',
        type: MetricType.DURATION,
        currentVal: 522, // 8m 42s
        previousVal: 466,
        targetVal: 480,
        unit: 's',
        trendData: [64, 68, 71, 70, 74, 77, 79, 82, 80, 85, 88, 91],
      },
      {
        name: 'conversion_rate',
        label: 'Conversion Rate',
        category: 'Conversion',
        type: MetricType.PERCENTAGE,
        currentVal: 5.19,
        previousVal: 5.29,
        targetVal: 5.50,
        unit: '%',
        trendData: [62, 58, 61, 64, 60, 57, 59, 62, 58, 54, 57, 60],
      },
    ],
  });

  // Active Telemetry Anomalies
  await prisma.anomaly.createMany({
    data: [
      {
        time: '09:14',
        metric: 'API Latency',
        value: '847ms',
        expected: '< 120ms',
        severity: Severity.CRITICAL,
        status: AnomalyStatus.ACTIVE,
        zScore: 3.42,
        userId: user.id,
      },
      {
        time: '11:32',
        metric: 'Error Rate',
        value: '3.8%',
        expected: '< 0.5%',
        severity: Severity.HIGH,
        status: AnomalyStatus.ACTIVE,
        zScore: 2.76,
        userId: user.id,
      },
      {
        time: '14:07',
        metric: 'Drop-off Rate',
        value: '+142%',
        expected: 'baseline',
        severity: Severity.MEDIUM,
        status: AnomalyStatus.INVESTIGATING,
        zScore: 2.15,
        userId: user.id,
      },
      {
        time: '16:55',
        metric: 'Revenue/Session',
        value: '-34%',
        expected: 'baseline',
        severity: Severity.MEDIUM,
        status: AnomalyStatus.RESOLVED,
        zScore: -2.08,
        userId: user.id,
      },
    ],
  });

  // Statistical AI Insights
  await prisma.insight.createMany({
    data: [
      {
        category: 'Revenue',
        headline: 'Cohort Nov-2025 is converting 2.8× faster than historical baseline',
        metricBadge: '+2.8× conversion velocity',
        explanation: 'Users acquired through in-app referral links in November 2025 are reaching their first paid subscription 3.1 days faster than the trailing 90-day cohort average. Accelerated onboarding completion is the dominant driver.',
        confidence: 94,
        actionLabel: 'View cohort',
        actionUrl: '/analytics',
      },
      {
        category: 'Anomaly',
        headline: 'Unusual drop in mobile DAU correlates with iOS 18.2 release',
        metricBadge: '−18% mobile DAU',
        explanation: 'A statistically significant 18% decline in iOS daily active users began 4 hours after the iOS 18.2 rollout. Desktop DAU remained stable. Likely related to a breaking change in background sync permissions.',
        confidence: 87,
        actionLabel: 'Investigate',
        actionUrl: '/analytics',
      },
      {
        category: 'Opportunity',
        headline: 'APAC segment shows 340% higher LTV than predicted at sign-up',
        metricBadge: '$2,840 avg LTV',
        explanation: 'Users from APAC markets, particularly Singapore and Japan, are exhibiting enterprise-tier feature adoption patterns despite signing up on Individual plans. Targeted upgrade prompts could unlock $1.2M in incremental ARR.',
        confidence: 79,
        actionLabel: 'View segment',
        actionUrl: '/datasets',
      },
      {
        category: 'Trend',
        headline: 'Dashboard export feature usage up 312% — docs viewing down 28%',
        metricBadge: '+312% export usage',
        explanation: 'Over the past 14 days, PDF and CSV export actions have grown 312%. Simultaneously, documentation page views dropped 28%. Users may be building their own reporting workflows, reducing reliance on in-app docs.',
        confidence: 82,
        actionLabel: 'View feature data',
        actionUrl: '/analytics',
      },
    ],
  });

  // Seed Datasets matching Figma
  const ds1 = await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'User Events — Production',
      description: 'Raw high-frequency telemetry events from production web and mobile clients.',
      rowsCount: 128400000,
      sizeBytes: BigInt(18200000000), // 18.2 GB
      status: DatasetStatus.LIVE,
      tags: ['events', 'prod'],
      data: [
        { event_id: 'ev_001', user_id: 'usr_882', event_name: 'dashboard_load', latency_ms: 48, status: '200' },
        { event_id: 'ev_002', user_id: 'usr_883', event_name: 'export_csv', latency_ms: 112, status: '200' },
        { event_id: 'ev_003', user_id: 'usr_884', event_name: 'query_execute', latency_ms: 82, status: '200' },
        { event_id: 'ev_004', user_id: 'usr_885', event_name: 'auth_verify', latency_ms: 36, status: '200' },
      ],
      columns: {
        create: [
          { name: 'timestamp', dataType: 'DATE', isTime: true },
          { name: 'user_id', dataType: 'STRING' },
          { name: 'event_name', dataType: 'STRING' },
          { name: 'latency_ms', dataType: 'NUMBER', isMetric: true },
        ],
      },
    },
  });

  await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'Revenue Transactions Q4',
      description: 'Ledger of all verified Stripe subscription renewals and enterprise upgrades.',
      rowsCount: 4200000,
      sizeBytes: BigInt(892000000), // 892 MB
      status: DatasetStatus.READY,
      tags: ['revenue', 'finance'],
      data: [
        { transaction_id: 'tx_991', plan: 'Enterprise', amount_usd: 12000, currency: 'USD' },
        { transaction_id: 'tx_992', plan: 'Pro', amount_usd: 480, currency: 'USD' },
        { transaction_id: 'tx_993', plan: 'Team', amount_usd: 1200, currency: 'USD' },
      ],
      columns: {
        create: [
          { name: 'transaction_id', dataType: 'STRING' },
          { name: 'amount_usd', dataType: 'NUMBER', isMetric: true },
          { name: 'plan', dataType: 'STRING' },
        ],
      },
    },
  });

  await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'ML Feature Store v3',
      description: 'Precomputed user propensity scores and behavioral embeddings for recommendation.',
      rowsCount: 62100000,
      sizeBytes: BigInt(7400000000), // 7.4 GB
      status: DatasetStatus.READY,
      tags: ['ml', 'features'],
    },
  });

  await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'Customer 360 Profiles',
      description: 'Aggregated firmographic profiles and account health metrics.',
      rowsCount: 1800000,
      sizeBytes: BigInt(2100000000), // 2.1 GB
      status: DatasetStatus.READY,
      tags: ['crm', 'profiles'],
    },
  });

  await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'Clickstream Archive 2023',
      description: 'Cold storage clickstream telemetry logs for historical cohort baselines.',
      rowsCount: 890000000,
      sizeBytes: BigInt(142000000000), // 142 GB
      status: DatasetStatus.ARCHIVED,
      tags: ['clickstream', 'archive'],
    },
  });

  await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'A/B Experiment Results',
      description: 'Live multi-variant tests across new onboarding flow iterations.',
      rowsCount: 18200000,
      sizeBytes: BigInt(1800000000), // 1.8 GB
      status: DatasetStatus.PROCESSING,
      tags: ['experiments'],
    },
  });

  // Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        type: 'anomaly',
        title: 'Critical anomaly detected',
        body: 'API latency spiked to 847ms — 7× above threshold on /api/v1/query endpoint.',
        read: false,
      },
      {
        userId: user.id,
        type: 'insight',
        title: 'New AI insight available',
        body: 'Revenue cohort analysis complete for Q4 2025. Positive velocity recorded.',
        read: false,
      },
      {
        userId: user.id,
        type: 'alert',
        title: 'Dataset processing complete',
        body: 'ML Feature Store v3 finished reprocessing (62.1M rows).',
        read: false,
      },
      {
        userId: user.id,
        type: 'report',
        title: 'Weekly executive report ready',
        body: 'Your scheduled KPI digest for Nov 18–24 is compiled and ready for review.',
        read: true,
      },
    ],
  });

  // Seed Activity Log
  await prisma.activityLog.createMany({
    data: [
      {
        userId: user.id,
        action: 'Ran cohort retention analysis',
        resource: 'User Events — Production',
      },
      {
        userId: user.id,
        action: 'Reviewed AI insight',
        resource: 'APAC Segment LTV',
      },
      {
        userId: user.id,
        action: 'Exported revenue report',
        resource: 'Revenue Transactions Q4',
      },
      {
        userId: user.id,
        action: 'Created dashboard snapshot',
        resource: 'Command Center',
      },
    ],
  });

  console.log('✅ Veltrix database successfully seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
