import { OrderStatus } from '@prisma/client';

import type { MailService } from '@/infrastructure/mail/mail.service';
import type { OrderStatusUpdateData } from '@/infrastructure/mail/templates';

/**
 * Lab 6 — Data-Driven refactoring: buyer notification per sub-order transition.
 *
 * The former if/else chain (CC 16) becomes data: key = "FROM->TO", value =
 * which mail to send. A new rule is a new row, not a new branch, so the
 * cyclomatic complexity of the caller no longer grows with the business rules.
 */
export type StatusMailer = (
  mail: MailService,
  to: string,
  data: OrderStatusUpdateData,
) => Promise<unknown>;

type TransitionKey = `${OrderStatus}->${OrderStatus}`;

const confirmed: StatusMailer = (mail, to, data) =>
  mail.sendOrderConfirmedNotification(to, data);
const shipped: StatusMailer = (mail, to, data) =>
  mail.sendOrderShippedNotification(to, data);
const delivered: StatusMailer = (mail, to, data) =>
  mail.sendOrderDeliveredNotification(to, data);
const cancelled: StatusMailer = (mail, to, data) =>
  mail.sendOrderCancelledNotification(to, data);
const skip: StatusMailer = () => Promise.resolve();

export const STATUS_MAIL_TABLE: Readonly<
  Partial<Record<TransitionKey, StatusMailer>>
> = Object.freeze({
  'NEW->PROCESSING': confirmed,
  'PROCESSING->SHIPPED': shipped,
  'SHIPPED->DELIVERED': delivered,
  'NEW->CANCELLED': cancelled,
  'PROCESSING->CANCELLED': cancelled,
});

/** Any transition that is not in the table (incl. FROM === TO) sends nothing. */
export const mailerFor = (from: OrderStatus, to: OrderStatus): StatusMailer =>
  STATUS_MAIL_TABLE[`${from}->${to}`] ?? skip;
