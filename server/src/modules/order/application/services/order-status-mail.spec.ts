// Lab 6 — behaviour lock for the buyer notification rules.
// The same suite must stay green on the FAIL commit (if/else monolith, CC 16)
// and on the PASS commit (lookup table, CC 2): refactoring changes topology, not behaviour.
import { OrderItem, SubOrder } from '@order/domain/entities';
import { OrderStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

import { OrderService } from './order.service';

const mail = {
  sendOrderConfirmedNotification: mock(() => Promise.resolve()),
  sendOrderShippedNotification: mock(() => Promise.resolve()),
  sendOrderDeliveredNotification: mock(() => Promise.resolve()),
  sendOrderCancelledNotification: mock(() => Promise.resolve()),
};
type MailMethod = keyof typeof mail;

const service = new OrderService(
  {} as any,
  {} as any,
  {} as any,
  { get: () => '' } as any,
  {} as any,
  mail as any,
);
const send = (subOrder: SubOrder, to: OrderStatus): Promise<void> =>
  (service as any).sendStatusUpdateEmail(subOrder, to);

const subOrder = (
  from: OrderStatus,
  buyer: any = { id: 'b-1', email: 'buyer@example.com', name: 'Olena' },
  supplier: any = { name: 'Oak & Co' },
) =>
  new SubOrder(
    'sub-1',
    'order-1',
    from,
    'supplier-1',
    null,
    [
      new OrderItem('i-1', 'sub-1', 'p-1', 2, 100, 'Table', 'T-1'),
      new OrderItem('i-2', 'sub-1', 'p-2', 3, 10, 'Chair', 'C-1'),
    ],
    new Date(),
    new Date(),
    supplier,
    buyer,
  );

const calls = () =>
  (Object.keys(mail) as MailMethod[]).filter(m => mail[m].mock.calls.length);

describe('sendStatusUpdateEmail — transition -> notification', () => {
  beforeEach(() => Object.values(mail).forEach(m => m.mockClear()));

  const cases: Array<[OrderStatus, OrderStatus, MailMethod | null]> = [
    ['NEW', 'PROCESSING', 'sendOrderConfirmedNotification'],
    ['PROCESSING', 'SHIPPED', 'sendOrderShippedNotification'],
    ['SHIPPED', 'DELIVERED', 'sendOrderDeliveredNotification'],
    ['NEW', 'CANCELLED', 'sendOrderCancelledNotification'],
    ['PROCESSING', 'CANCELLED', 'sendOrderCancelledNotification'],
    ['NEW', 'NEW', null],
    ['SHIPPED', 'CANCELLED', null],
    ['DELIVERED', 'SHIPPED', null],
    ['NEW', 'SHIPPED', null],
  ];

  for (const [from, to, expected] of cases) {
    it(`${from} -> ${to}: ${expected ?? 'no email'}`, async () => {
      await send(subOrder(from), to);
      expect(calls()).toEqual(expected ? [expected] : []);
    });
  }

  it('no buyer e-mail -> nothing is sent', async () => {
    await send(subOrder('NEW', { id: 'b-1', email: '' }), 'PROCESSING');
    expect(calls()).toEqual([]);
  });

  it('payload: recipient, totals and names', async () => {
    await send(subOrder('NEW'), 'PROCESSING');
    const [to, data] = mail.sendOrderConfirmedNotification.mock
      .calls[0] as unknown as [string, any];
    expect(to).toBe('buyer@example.com');
    expect(data).toMatchObject({
      orderId: 'order-1',
      subOrderId: 'sub-1',
      buyerName: 'Olena',
      supplierName: 'Oak & Co',
      subOrderTotal: 230,
    });
    expect(data.items).toHaveLength(2);
  });

  it('payload fallbacks: Customer / company name / Supplier', async () => {
    await send(
      subOrder(
        'PROCESSING',
        { email: 'b@x.ua' },
        { name: 'Ivan', profile: { company: { name: 'Gyp6 Wood LLC' } } },
      ),
      'SHIPPED',
    );
    await send(subOrder('SHIPPED', { email: 'b@x.ua' }, null), 'DELIVERED');
    const shipped = mail.sendOrderShippedNotification.mock.calls[0] as any;
    const delivered = mail.sendOrderDeliveredNotification.mock.calls[0] as any;
    expect(shipped[1]).toMatchObject({
      buyerName: 'Customer',
      supplierName: 'Gyp6 Wood LLC',
    });
    expect(delivered[1].supplierName).toBe('Supplier');
  });
});
