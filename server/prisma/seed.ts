import { PrismaClient, Role, MetricType, DatasetStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Veltrix database seed...');

  // Clean existing tables safely
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.datasetColumn.deleteMany();
  await prisma.dataset.deleteMany();
  await prisma.widget.deleteMany();
  await prisma.dashboard.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create default demo user
  const passwordHash = await bcrypt.hash('veltrix2026', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@veltrix.ai',
      name: 'Jordan Davis',
      passwordHash,
      role: Role.ADMIN,
      profile: {
        create: {
          company: 'Acme Corporation',
          title: 'Head of Analytics',
          location: 'San Francisco, CA',
          bio: 'Data architect specializing in modern high-throughput streaming analytics and predictive modeling.',
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

  // Seed Primary Metrics
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

  // Seed AI Insights
  await prisma.insight.createMany({
    data: [
      {
        category: 'Revenue',
        headline: 'Cohort Nov-2025 is converting 2.8× faster than historical baseline',
        metricBadge: '+2.8× conversion velocity',
        explanation: 'Users acquired through in-app referral links in November 2025 are reaching their first paid subscription 3.1 days faster than the trailing 90-day cohort average. Accelerated onboarding completion is the dominant driver.',
        confidence: 94,
        actionLabel: 'View cohort',
        actionUrl: '/analytics?tab=cohorts',
      },
      {
        category: 'Anomaly',
        headline: 'Unusual drop in mobile DAU correlates with iOS 18.2 release',
        metricBadge: '−18% mobile DAU',
        explanation: 'A statistically significant 18% decline in iOS daily active users began 4 hours after the iOS 18.2 rollout. Desktop DAU remained stable. Likely related to a breaking change in background sync permissions.',
        confidence: 87,
        actionLabel: 'Investigate',
        actionUrl: '/analytics?tab=performance',
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

  // Seed Datasets
  const ds1 = await prisma.dataset.create({
    data: {
      userId: user.id,
      name: 'User Events — Production',
      description: 'Raw high-frequency telemetry events from all production web and mobile clients.',
      rowsCount: 128400000,
      sizeBytes: BigInt(18200000000),
      status: DatasetStatus.LIVE,
      tags: ['events', 'prod'],
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
      description: 'Normalized ledger of all successful Stripe subscription renewals and upgrades.',
      rowsCount: 4200000,
      sizeBytes: BigInt(892000000),
      status: DatasetStatus.READY,
      tags: ['revenue', 'finance'],
      columns: {
        create: [
          { name: 'transaction_id', dataType: 'STRING' },
          { name: 'amount_usd', dataType: 'NUMBER', isMetric: true },
          { name: 'plan', dataType: 'STRING' },
          { name: 'date', dataType: 'DATE', isTime: true },
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
      sizeBytes: BigInt(7400000000),
      status: DatasetStatus.READY,
      tags: ['ml', 'features'],
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
